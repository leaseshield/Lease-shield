import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore, storage, auth
# from werkzeug.utils import secure_filename # No longer needed for saving temp files if done carefully
import PyPDF2
import io # Needed for reading file stream
from dotenv import load_dotenv # Import dotenv
import requests # For Maxelpay API call
import base64 # For Maxelpay encryption
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes # For Maxelpay encryption
from cryptography.hazmat.backends import default_backend # For Maxelpay encryption
import time # For timestamp
import uuid # For unique order ID
import hmac
import hashlib
# Import the specific exception for permission errors
from google.api_core.exceptions import PermissionDenied, GoogleAPIError 
import datetime # Needed for daily scan logic
import calendar # Added for days in month calculation
# Add imports for file handling if needed (os is already imported)
from PIL import Image # Potentially needed for image processing/validation
import mimetypes # To determine image MIME type

# --- Logging configuration ---
import logging
logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"),
                    format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

# --- Optional OCR and Error Tracking ---
try:
    from pdf2image import convert_from_bytes
    import pytesseract
except ImportError:
    convert_from_bytes = None
    pytesseract = None
    logger.warning("pdf2image or pytesseract not available – rich PDF extraction will be limited to text only.")

# Sentry for error tracking
try:
    import sentry_sdk
    from sentry_sdk.integrations.flask import FlaskIntegration
    SENTRY_DSN = os.environ.get('SENTRY_DSN')
    if SENTRY_DSN:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            integrations=[FlaskIntegration()],
            traces_sample_rate=0.2,
        )
        logger.info("Sentry initialised for error tracking.")
    else:
        logger.info("Sentry DSN not set; error tracking disabled.")
except ImportError:
    logger.info("Warning: sentry_sdk not installed – error tracking disabled.")
# --- End imports ---

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'heic', 'heif'}
ALLOWED_FINANCE_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
MAX_IMAGE_SIZE_MB = 5
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

# Placeholder for the actual PayID19 library - replace if needed
try:
    import payid19_python_sdk as payid19 
except ImportError:
    logger.info("WARNING: PayID19 SDK placeholder not found. Payment endpoint will fail.")
    payid19 = None # Define it as None so the app doesn't crash

load_dotenv() # Load environment variables from .env file

# --- Load Gemini API Keys --- 
# Load all potential keys, filtering out any that aren't set
gemini_api_keys = [
    key for key in [
        os.environ.get('GEMINI_API_KEY_1'),
        os.environ.get('GEMINI_API_KEY_2'),
        os.environ.get('GEMINI_API_KEY_3'),
        # Keep the original name as a fallback for backward compatibility or single-key use
        os.environ.get('GEMINI_API_KEY')
    ] if key
]

if not gemini_api_keys:
    logger.critical(
        "No Gemini API keys found in environment variables (GEMINI_API_KEY_1, _2, _3, or GEMINI_API_KEY)."
    )
    raise SystemExit(1)

# --- Flask App and Firebase Initialization --- 
app = Flask(__name__)

# Configure CORS explicitly
CORS(app, 
     origins=[
         "https://lease-shield-frontend.onrender.com", 
         "http://localhost:3000",
         "https://leaseshield.eu",
         "https://leasesheild.eu"
     ], 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], # Explicitly allow methods
     headers=["Content-Type", "Authorization"],       # Explicitly allow headers
     supports_credentials=True,
     # expose_headers=["Content-Length"] # Optional: Add if frontend needs specific headers
)

# --- Initialize Firebase Admin SDK (Handles Local and Deployed) ---
db = None # Initialize db to None
try:
    firebase_sdk_json_str = os.environ.get('FIREBASE_ADMIN_SDK_JSON_CONTENT')
    
    if firebase_sdk_json_str:
        # Deployed on Render (or env var set manually using JSON content)
        logger.info("Using Firebase key from environment variable.")
        firebase_sdk_config = json.loads(firebase_sdk_json_str)
        cred = credentials.Certificate(firebase_sdk_config)
        project_id = firebase_sdk_config.get('project_id')
        # Initialize Firebase app when running with JSON content from env vars
        firebase_admin.initialize_app(cred, {
            'storageBucket': f"{project_id}.appspot.com"
        })
        logger.info("Firebase Admin SDK initialized successfully.")
        db = firestore.client()
    else:
        # Running Locally - Check for Render Secret File path OR local path
        render_secret_path = '/etc/secrets/firebase_key.json'
        local_key_path = 'lease-shield-ai-firebase-admin-sdk.json'  # Assuming file is in same dir as app.py

        if os.path.exists(render_secret_path):
            logger.info(f"Using Firebase key from Render secret file: {render_secret_path}")
            cred = credentials.Certificate(render_secret_path)
            # Attempt to get project_id from credential object
            try:
                project_id = cred.project_id
            except Exception as cred_err:
                logger.warning(f"Could not get project_id from credential object: {cred_err}")
                try:
                    with open(render_secret_path, 'r') as f:
                        key_data = json.load(f)
                    project_id = key_data.get('project_id')
                except Exception as parse_err:
                    logger.error(f"Error parsing secret file for project_id: {parse_err}")
                    project_id = None
        elif os.path.exists(local_key_path):
            logger.info(f"Using Firebase key from local file: {local_key_path}")
            cred = credentials.Certificate(local_key_path)
            # Attempt to parse the file to get project_id
            try:
                with open(local_key_path, 'r') as f:
                    key_data = json.load(f)
                project_id = key_data.get('project_id')
            except Exception as parse_err:
                logger.error(f"Error parsing local key file for project_id: {parse_err}")
                project_id = None
        else:
            raise FileNotFoundError(f"Firebase key file not found at {render_secret_path} or {local_key_path}")

        if not project_id:
            raise ValueError("Could not determine Firebase project ID from credentials.")

        firebase_admin.initialize_app(cred, {
            'storageBucket': f"{project_id}.appspot.com"
        })
        logger.info("Firebase Admin SDK initialized successfully.")
        db = firestore.client()

except FileNotFoundError as e:
    logger.critical(f"Firebase Admin SDK JSON key file not found. {e}")
    db = None # Ensure db is None if init fails
except ValueError as e:
    logger.critical(f"Invalid Firebase Admin SDK JSON content or missing project_id. {e}")
    db = None # Ensure db is None if init fails
except Exception as e:
    logger.critical(f"Failed to initialize Firebase Admin SDK: {e}")
    db = None # Ensure db is None if init fails

# Only proceed if db was initialized
if db is None:
    logger.critical("Aborting application startup due to Firebase initialization failure.")
    # Optional: exit the application if Firebase is absolutely required
    # sys.exit(1) 



# Max characters for pasted text analysis
MAX_TEXT_LENGTH = 50000 # Approx 10-15 pages

# Verify Maxelpay webhook signature using HMAC SHA256
def verify_maxelpay_signature(payload, signature, secret):
    try:
        expected = hmac.new(secret.encode('utf-8'), payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature or '')
    except Exception as e:
        logger.error(f"Signature verification error: {e}")
        return False

# Verify Firebase Auth token
def verify_token(id_token):
    try:
        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        return decoded_token['uid']
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return None

# Check if user ID belongs to the designated admin email
def is_admin(user_id):
    if not user_id:
        return False
    try:
        user = firebase_admin.auth.get_user(user_id)
        admin_email = os.environ.get('ADMIN_EMAIL')
        return admin_email and user.email == admin_email
    except Exception as e:
        logger.error(f"Error checking admin status for {user_id}: {e}")
        return False

def extract_pdf_rich_content(file_stream):
    """
    Extracts text from a PDF, using OCR as a fallback for scanned images.
    """
    text = ""
    # Try extracting text directly
    try:
        file_stream.seek(0)
        reader = PyPDF2.PdfReader(file_stream)
        for page in reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        logger.info(f"PyPDF2 error: {e}. Might be a scanned PDF.")

    # If no text, or if OCR libraries are available, try OCR
    if not text.strip() and convert_from_bytes and pytesseract:
        logger.info("Falling back to OCR for PDF content.")
        try:
            file_stream.seek(0)
            images = convert_from_bytes(file_stream.read())
            for image in images:
                text += pytesseract.image_to_string(image) + "\n"
        except Exception as ocr_error:
            logger.info(f"OCR processing failed: {ocr_error}")
            # Potentially return a specific error message if OCR fails
            return None
            
    if not text.strip():
        logger.info("Warning: PDF appears to be empty or unreadable.")
        return None
        
    return text

# Modified to accept a file stream/object instead of path
def extract_pdf_text(file_stream):
    text = ""
    try:
        reader = PyPDF2.PdfReader(file_stream)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            # Append a real newline between pages rather than a literal "\n"
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.info(f"PDF extraction error: {e}")
        return None

# Analyze lease with Gemini
def analyze_lease(text):
    """Analyze lease text using Gemini 2.5 Pro with a double-pass JSON correction step."""
    base_prompt = f"""
    Analyze the following lease document. Extract the specified information and format the output ONLY as a single JSON object. 
    Do not include any text before or after the JSON object (no markdown fences).
    The JSON object must have these top-level keys: 'extracted_data', 'clause_summaries', 'risks', and 'score'.

    1. extracted_data: An object with these exact keys. If a value cannot be found, use the string "Not Found".
       - Landlord_Name
       - Tenant_Name
       - Property_Address
       - Lease_Start_Date
       - Lease_End_Date
       - Monthly_Rent_Amount
       - Rent_Due_Date
       - Security_Deposit_Amount
       - Lease_Term

    2. clause_summaries: Summarize these clauses using the exact key names (omit if not present or use "Not Found").
       - Termination_Clause
       - Pet_Policy
       - Subletting_Policy
       - Maintenance_Responsibilities
       - Late_Fee_Policy
       - Renewal_Options

    3. risks: Array of strings describing unusual or unfavorable clauses. Return [] if none.

    4. score: Integer from 0 (unfavorable) to 100 (favorable), based on number and severity of risks.

    Lease Document Text:
    --- START ---
    {text}
    --- END ---

    Output ONLY the JSON.
    """

    try:
        # Pass 1 (Pro, lower temperature for precision)
        model_pass1 = get_gemini_model(model_name='gemini-2.5-pro', temperature=0.2)
        resp1 = model_pass1.generate_content(base_prompt)
        cleaned1 = (resp1.text or '').strip().lstrip('```json').rstrip('```').strip()

        # Try to parse
        try:
            json.loads(cleaned1)
            return cleaned1
        except Exception:
            pass

        # Pass 2 (Refinement) - ask model to strictly fix JSON
        refine_prompt = f"""
        The following was intended to be a single strict JSON object response but may contain formatting issues or extra commentary.
        Return ONLY a corrected JSON object that strictly adheres to the schema described earlier.
        If any fields are missing, include them with the value "Not Found" where appropriate.
        Response to correct:
        ---
        {cleaned1}
        ---
        """
        model_pass2 = get_gemini_model(model_name='gemini-2.5-pro', temperature=0.1)
        resp2 = model_pass2.generate_content(refine_prompt)
        cleaned2 = (resp2.text or '').strip().lstrip('```json').rstrip('```').strip()
        return cleaned2
    except Exception as e:
        logger.info(f"analyze_lease error: {e}")
        return None

def analyze_compliance(new_lease_text, master_template_text):
    """
    Compares a new lease against a master template using Gemini AI.
    Returns a JSON object with a summary of deviations.
    """
    prompt = f"""
    You are a compliance analysis bot. Compare the 'New Lease Document' against the 'Master Template'.
    Your goal is to identify differences, deviations, and any clauses present in the new lease that are NOT in the master template.

    Master Template Text:
    --- START ---
    {master_template_text}
    --- END ---

    New Lease Document Text:
    --- START ---
    {new_lease_text}
    --- END ---

    Analyze the documents and provide a report ONLY in a single JSON object format.
    The JSON object must have one top-level key: 'compliance_report'.
    The value of 'compliance_report' should be an object with three keys:
    1.  `summary`: A brief, one-sentence summary of the overall compliance (e.g., "The document largely conforms to the master template with minor deviations.").
    2.  `deviations`: An array of objects, where each object describes a specific deviation. Each object should have two keys: `clause_title` (e.g., "Termination Clause") and `description` (e.g., "The notice period was changed from 30 days in the template to 60 days.").
    3.  `missing_clauses`: An array of strings, where each string is the title of a clause present in the Master Template but missing from the New Lease Document.

    If no deviations or missing clauses are found, return empty arrays for those keys.
    Do not include any text before or after the JSON object.
    """
    try:
        model = get_gemini_model() # Use the standard model with key rotation
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip().lstrip('```json').rstrip('```').strip()
        return json.loads(cleaned_text)
    except Exception as e:
        logger.info(f"Error during compliance analysis: {e}")
        return {"compliance_report": {
            "summary": "Failed to generate compliance report due to an internal error.",
            "deviations": [],
            "missing_clauses": []
        }}

# --- Maxelpay Encryption Helper --- 
def maxelpay_encryption(secret_key, payload_data):
  """Encrypts payload data for Maxelpay API using AES CBC."""
  try:
    # Convert to bytes
    iv = os.urandom(16)
    secret_key_bytes = secret_key.encode("utf-8")  
    
    # Pad data to match the block size (AES block size is 128 bits / 16 bytes, but example used 256? Let's stick to AES standard 16)
    # The example padding seemed incorrect for AES-256 CBC. Using standard PKCS7 padding is more robust, 
    # but requests library often handles content-type correctly without manual padding if data is JSON.
    # Let's follow the provided example's explicit padding for now, but use 16-byte blocks.
    block_size_bytes = 16 # AES block size
    payload_json_bytes = json.dumps(payload_data).encode("utf-8")
    padding_length = block_size_bytes - (len(payload_json_bytes) % block_size_bytes)
    padded_data = payload_json_bytes + bytes([padding_length]) * padding_length # PKCS7 padding

    # Original example padding (might be specific to Maxelpay? Keep if PKCS7 fails)
    # block_size_manual = 256 
    # padded_data = json.dumps(payload_data).encode("utf-8")
    # padded_data += b' ' * (block_size_manual - len(padded_data) % block_size_manual)

    backend = default_backend()
    # Ensure secret key length is suitable for AES-256 (32 bytes)
    if len(secret_key_bytes) != 32:
        logger.info(f"Warning: Maxelpay Secret Key length is {len(secret_key_bytes)} bytes, expected 32 for AES-256. Check documentation.")
        # Handle error or potentially pad/truncate key if required by Maxelpay (less secure)
        # For now, we'll let Cipher raise an error if length is wrong.

    cipher = Cipher(algorithms.AES(secret_key_bytes), modes.CBC(iv), backend=backend) 
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize() 
    # Prepend IV so that it is available for decryption on the receiver side
    result = base64.b64encode(iv + encrypted_data).decode("utf-8")
    return result
  except Exception as e:
      logger.info(f"Maxelpay encryption error: {e}")
      raise # Re-raise the exception to be caught in the route

# --- End Maxelpay Encryption Helper ---

# --- Firestore User Helpers --- 

def get_or_create_user_profile(user_id):
    """Gets user profile from Firestore, creates default free tier if not found."""
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    if user_doc.exists:
        # Ensure existing profiles have new fields (handle potential missing fields)
        profile_data = user_doc.to_dict()
        if 'dailyScansUsed' not in profile_data:
            profile_data['dailyScansUsed'] = 0
        if 'lastScanDate' not in profile_data:
            profile_data['lastScanDate'] = None # Or a default past date string like '1970-01-01'
        if 'lastMonthlyScan' not in profile_data:
            profile_data['lastMonthlyScan'] = datetime.date.today().strftime('%Y-%m')
            try:
                user_ref.update({'lastMonthlyScan': profile_data['lastMonthlyScan']})
            except Exception as e:
                logger.info(f"Warning: could not backfill lastMonthlyScan for {user_id}: {e}")
        return profile_data
    else:
        logger.info(f"Creating default free profile for user: {user_id}")
        default_profile = {
            'userId': user_id, 
            'subscriptionTier': 'free',
            'freeScansUsed': 0,
            'maxAllowedScans': 3, # Default for free tier
            'dailyScansUsed': 0,
            'lastScanDate': None, # Initialize as None
            'createdAt': firestore.SERVER_TIMESTAMP,
            'lastMonthlyScan': datetime.date.today().strftime('%Y-%m')
        }
        try:
            user_ref.set(default_profile)
            return default_profile
        except Exception as e:
             logger.info(f"Error creating user profile for {user_id}: {e}")
             return None # Indicate failure

def increment_scan_counts(user_id, tier):
    """Atomically increments scan counts based on tier."""
    user_ref = db.collection('users').document(user_id)
    today_str = datetime.date.today().isoformat() # Get YYYY-MM-DD

    try:
        # Use a transaction to ensure atomicity if needed, but separate updates might be fine
        
        # Increment monthly count for limited tiers (free, commercial, premium)
        if tier in ['free', 'commercial', 'premium']:
            user_ref.update({
                'freeScansUsed': firestore.Increment(1),
                'lastMonthlyScan': today_str[:7]  # Store YYYY-MM of current month
            })
            logger.info(f"Incremented monthly scan count for user {user_id} (tier: {tier})")

        # Handle daily count for premium tier
        if tier == 'premium':
            # Fetch current daily count and date first
            user_doc = user_ref.get()
            if user_doc.exists:
                profile_data = user_doc.to_dict()
                last_scan_date = profile_data.get('lastScanDate')
                daily_scans = profile_data.get('dailyScansUsed', 0)

                update_data = {}
                if last_scan_date == today_str:
                    # Same day, just increment
                    update_data['dailyScansUsed'] = firestore.Increment(1)
                    logger.info(f"Incremented daily scan count for user {user_id} (tier: {tier})")
                else:
                    # New day, reset count to 1 and update date
                    update_data['dailyScansUsed'] = 1
                    update_data['lastScanDate'] = today_str
                    logger.info(f"Reset daily scan count to 1 for user {user_id} (tier: {tier}) on new day {today_str}")
                
                user_ref.update(update_data)
            else:
                 logger.info(f"Error: Could not find user {user_id} to update daily scan count.")
                 return False # Indicate failure if user doc missing

        return True
    except Exception as e:
        logger.info(f"Error incrementing scan counts for {user_id} (tier: {tier}): {e}")
        return False

# --- End Firestore User Helpers --- 

# --- Global Daily Chat Message Limit Helpers ---
from google.cloud.firestore import Transaction  # Added for typing clarity but optional

def _get_today_iso():
    # Use UTC date to ensure consistent daily reset regardless of server timezone
    return datetime.datetime.utcnow().date().isoformat()

# Firestore document to store global chat stats
_CHAT_STATS_DOC_ID = 'chat_messages'
_CHAT_STATS_COLLECTION = 'stats'
_GLOBAL_CHAT_LIMIT = 500  # messages per UTC day
_USER_CHAT_COLLECTION = 'user_chat_stats'
_PER_USER_CHAT_LIMIT = 50  # per-user messages per day

def _increment_chat_count_if_not_limited(limit=_GLOBAL_CHAT_LIMIT):
    """
    Atomically checks the limit and increments the counter if not reached.

    Returns:
        bool: True if the increment was successful, False if the limit had been reached.
    """
    if db is None:
        logger.info("Database not initialised; cannot track chat quota.")
        return False  # Fail open, but log it

    stats_ref = db.collection(_CHAT_STATS_COLLECTION).document(_CHAT_STATS_DOC_ID)
    today_str = _get_today_iso()

    @firestore.transactional
    def tx_func(transaction):
        snapshot = stats_ref.get(transaction=transaction)
        
        if snapshot.exists:
            data = snapshot.to_dict()
            if data.get('date') == today_str:
                current_count = data.get('count', 0)
                if current_count >= limit:
                    # Limit is reached, do not increment. Signal failure.
                    return False
                # Limit not reached, increment the count.
                transaction.update(stats_ref, {'count': firestore.Increment(1)})
            else:
                # It's a new day, reset the counter.
                transaction.set(stats_ref, {'date': today_str, 'count': 1})
        else:
            # The document doesn't exist, create it for the first message.
            transaction.set(stats_ref, {'date': today_str, 'count': 1})
        
        # If we get here, the increment was successful.
        return True

    try:
        # run_transaction will return the value from the decorated function.
        return db.run_transaction(tx_func)
    except Exception as e:
        logger.error(f"Chat counter transaction failed: {e}")
        # Fail open to not block users, but this needs to be monitored.
        return True


def _increment_user_chat_count_if_not_limited(user_id, limit=_PER_USER_CHAT_LIMIT):
    if db is None:
        return False

    stats_ref = db.collection(_USER_CHAT_COLLECTION).document(user_id)
    today_str = _get_today_iso()

    @firestore.transactional
    def tx_func(transaction):
        snapshot = stats_ref.get(transaction=transaction)
        if snapshot.exists:
            data = snapshot.to_dict()
            if data.get('date') == today_str:
                current_count = data.get('count', 0)
                if current_count >= limit:
                    return False
                transaction.update(stats_ref, {'count': firestore.Increment(1)})
            else:
                transaction.set(stats_ref, {'date': today_str, 'count': 1})
        else:
            transaction.set(stats_ref, {'date': today_str, 'count': 1})
        return True

    try:
        return db.run_transaction(tx_func)
    except Exception as e:
        logger.error(f"User chat counter transaction failed: {e}")
        return True

# --- End Global Daily Chat Message Limit Helpers ---

# --- Ping Endpoint --- 
@app.route('/api/ping', methods=['GET'])
def ping():
    """Simple endpoint to keep the backend alive."""
    # No auth needed, just return success
    return jsonify({'status': 'pong'}), 200
# --- End Ping Endpoint ---

# --- AI Chat Endpoint ---
@app.route('/api/chat', methods=['POST'])
def ai_chat():
    """Endpoint to handle real-time chat messages with rate limits."""
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    if not _increment_user_chat_count_if_not_limited(user_id):
        return jsonify({'error': 'Daily user message limit reached', 'limitReached': True}), 429

    if not _increment_chat_count_if_not_limited():
        return jsonify({'error': 'The daily message limit has been reached. Please check back tomorrow.', 'limitReached': True}), 429

    # --- Form & File Parsing ---
    try:
        user_message = request.form.get('message', '').strip()
        requested_model = request.form.get('model')
        uploaded_files = request.files.getlist('files')

        if not user_message and not uploaded_files:
            return jsonify({'error': 'No message or files provided.'}), 400
    except Exception as e:
        return jsonify({'error': f'Error parsing request form: {e}'}), 400

    # --- Model Selection ---
    MODEL_MAP = {
        'gemini-2.5-flash': 'gemini-2.5-flash',
        'gemini-2.5-flash-lite': 'gemini-2.5-flash-lite',
        'gemini-2.5-pro': 'gemini-2.5-pro'
    }

    # Determine base model (frontend may send refined aliases like gemini-2.5-fly)
    base_model_key = requested_model
    use_refinement = request.form.get('use_refinement', 'false').lower() == 'true'

    # Map special refined aliases to their bases
    if requested_model == 'gemini-2.5-fly':
        base_model_key = 'gemini-2.5-flash'
        use_refinement = True
    elif requested_model == 'gemini-2.5-ultra':
        base_model_key = 'gemini-2.5-pro'
        use_refinement = True

    model_id_to_use = MODEL_MAP.get(base_model_key, 'gemini-2.5-pro')
    logger.info(f"Chat request using model: {model_id_to_use} (alias {requested_model}), refinement={use_refinement}")

    # --- Prompt Construction ---
    prompt_parts = []
    if user_message:
        prompt_parts.append(user_message)

    for file in uploaded_files:
        try:
            if file.mimetype.startswith('image/'):
                image_part = {"mime_type": file.mimetype, "data": file.read()}
                prompt_parts.append(image_part)
            elif file.mimetype == 'application/pdf':
                pdf_text = extract_pdf_rich_content(file.stream)
                if pdf_text:
                    prompt_parts.append(f"\\n--- PDF Content: {file.filename} ---\\n{pdf_text}")
            # Add other file types here if needed
        except Exception as e:
            logger.info(f"Error processing file {file.filename}: {e}")
            # Optionally append an error message to the prompt
            prompt_parts.append(f"\\n[Could not process file: {file.filename}]")

    if not prompt_parts:
         return jsonify({'error': 'Could not construct a valid prompt from the provided input.'}), 500

    # --- AI Generation ---
    try:
        # Special handling for the enhanced 'gemini-2.5-fly'
        if requested_model == 'gemini-2.5-fly':
            logger.info("Executing 3-pass creative refinement for gemini-2.5-fly")

            # Pass 1: Standard response
            model_standard = get_gemini_model(model_name=model_id_to_use, temperature=0.5) # Lower temp for precision
            pass1_response_obj = model_standard.generate_content(prompt_parts)
            pass1_response = pass1_response_obj.text.strip()
            logger.info(f"Fly Pass 1 (Standard): {pass1_response[:100]}...")

            # Pass 2: Creative response
            model_creative = get_gemini_model(model_name=model_id_to_use, temperature=1.0) # Higher temp for creativity
            pass2_response_obj = model_creative.generate_content(prompt_parts)
            pass2_response = pass2_response_obj.text.strip()
            logger.info(f"Fly Pass 2 (Creative): {pass2_response[:100]}...")

            # Pass 3: Synthesize and select the best response
            synthesis_prompt = f"""You have generated two responses to the same prompt.
Response A (standard):
---
{pass1_response}
---

Response B (more creative):
---
{pass2_response}
---

Your task is to analyze both responses and produce a final, superior answer.
You can choose one, or synthesize the best elements of both into a new, more complete response.
The final output should be the single best response, not a commentary on the differences.
Final Answer:"""
            
            model_synthesis = get_gemini_model(model_name=model_id_to_use) # Use default temp for synthesis
            final_response_obj = model_synthesis.generate_content(synthesis_prompt)
            final_response = final_response_obj.text.strip()
            logger.info(f"Fly Pass 3 (Synthesis): {final_response[:100]}...")

            # Return only the final synthesized response to the user
            response_data = {'response': final_response}
            return jsonify(response_data)

        # --- Default/Original Logic for other models ---
        model = get_gemini_model(model_name=model_id_to_use) # Use the key-rotating helper

        # First pass: Generate initial response
        initial_response = model.generate_content(prompt_parts)
        ai_response_text = initial_response.text.strip()

        if use_refinement:
            # This block now primarily serves gemini-2.5-ultra or other future standard refinement models
            refinement_prompt = [
                ai_response_text,
                "Refine and improve this response: Make it more accurate, complete, helpful, and concise while preserving the original meaning. Correct any errors and enhance clarity."
            ]
            refined_response_obj = model.generate_content(refinement_prompt)
            refined_response = refined_response_obj.text.strip()

            response_data = {
                'response': refined_response, # Final answer is the refined one
                'initial': ai_response_text,
                'refined': refined_response
            }
        else:
             response_data = {'response': ai_response_text}

        return jsonify(response_data)

    except Exception as e:
        logger.info(f"Gemini chat error with model {model_id_to_use}: {e}")
        return jsonify({'error': 'Failed to generate AI response. Please try a different model or check your input.', 'details': str(e)}), 500

# --- End AI Chat Endpoint ---

# --- Maxelpay Checkout Route ---
@app.route('/api/payid/create-checkout-session', methods=['POST']) # Keep route name consistent with frontend for now
def create_checkout_session():
    if db is None:
        logger.info("Error: Firestore database client not initialized.")
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500
    # --- Authorization --- 
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Optionally get user email for payload
    user_email = "Not Provided" 
    user_name = "Lease Shield User"
    try:
        firebase_user = auth.get_user(user_id)
        user_email = firebase_user.email or user_email
        user_name = firebase_user.display_name or user_name
    except Exception as e:
        logger.info(f"Could not fetch user details from Firebase: {e}")
    # --- End Authorization ---

    # --- Load API Keys and Config --- 
    api_key = os.environ.get('MAXELPAY_API_KEY')
    secret_key = os.environ.get('MAXELPAY_SECRET_KEY')
    environment = os.environ.get('MAXELPAY_ENVIRONMENT', 'stg') # Default to staging
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000') 

    if not api_key or not secret_key:
        logger.info("ERROR: Maxelpay API keys not found in environment variables.")
        return jsonify({'error': 'Server configuration error: Payment keys missing.'}), 500

    # --- Construct API Endpoint ---
    endpoint = f"https://api.maxelpay.com/v1/{environment}/merchant/order/checkout"
    if environment == 'stg': # Adjust subdomain for staging if needed (common practice)
        endpoint = f"https://api.stg.maxelpay.com/v1/{environment}/merchant/order/checkout" # Guessing staging URL

    # --- Get Plan Details (Assume $5 Pro Plan for now) ---
    # In a real app, this might come from the request or a config file
    amount = "5.00" # Use string with decimals as per example
    currency = "USD" # Or get from request if supporting multiple
    plan_description = "Lease Shield AI Pro Monthly"
    site_name = "Lease Shield AI"
    website_url = frontend_url # Or your main domain

    # --- Prepare Payload --- 
    order_id = str(uuid.uuid4()) # Generate a unique order ID
    timestamp = str(int(time.time())) # Current Unix timestamp as string

    # Construct dynamic URLs
    redirect_url = f"{frontend_url}/payment/success?order_id={order_id}"
    cancel_url = f"{frontend_url}/pricing?status=cancelled&order_id={order_id}"
    webhook_url = f"{request.url_root}api/maxelpay/webhook"

    payload_data = {
        "orderID": order_id,
        "amount": amount,
        "currency": currency,
        "timestamp": timestamp,
        "userName": user_name,
        "siteName": site_name,
        "userEmail": user_email,
        "redirectUrl": redirect_url,
        "websiteUrl": website_url,
        "cancelUrl": cancel_url,
        "webhookUrl": webhook_url
    }

    # --- Encrypt and Make API Call --- 
    try:
        encrypted_payload_data = maxelpay_encryption(secret_key, payload_data)
        
        api_payload = json.dumps({'data': encrypted_payload_data})
        
        headers = {
            "api-key": api_key,
            "Content-Type": "application/json"
        }

        logger.info(f"Sending request to Maxelpay: {endpoint}") # Log endpoint
        # logger.info(f"Payload (unencrypted): {payload_data}") # DEBUG - Don't log sensitive data in prod
        # logger.info(f"Headers: {headers}") # DEBUG
        # logger.info(f"Body (encrypted): {api_payload}") # DEBUG

        response = requests.request("POST", endpoint, headers=headers, data=api_payload, timeout=20) # Add timeout
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        response_data = response.json()
        logger.info(f"Maxelpay Response: {response_data}") # Log response

        # Extract the checkout URL - Updated to use 'result' key based on logs
        checkout_url = response_data.get('result') 

        if not checkout_url:
            logger.info("ERROR: Maxelpay response did not contain the 'result' key with the checkout URL.") # Updated error message
            return jsonify({'error': 'Failed to get checkout URL from payment provider response.', 'provider_response': response_data}), 500
        
        # --- Store checkout session details for webhook correlation ---
        try:
            session_ref = db.collection('checkout_sessions').document(order_id)
            session_ref.set({
                'userId': user_id,
                'maxelpayOrderId': order_id, # Redundant but clear
                'status': 'pending', # Initial status
                'createdAt': firestore.SERVER_TIMESTAMP,
                'amount': amount,
                'currency': currency
            })
            logger.info(f"Stored checkout session mapping for order {order_id} and user {user_id}")
        except Exception as db_error:
            # Log the error but proceed with returning the checkout URL to the user
            logger.info(f"Firestore Error: Failed to store checkout session mapping for order {order_id}: {db_error}")
            # Depending on requirements, you might want to prevent checkout if this fails
            # For now, we let the user proceed to pay. Manual reconciliation might be needed if webhook fails.
        # --- End Store checkout session ---

        return jsonify({'checkoutUrl': checkout_url})

    except requests.exceptions.RequestException as req_err:
        logger.info(f"Maxelpay API request failed: {req_err}")
        # Log response body if available
        error_body = None
        if req_err.response is not None:
            try: error_body = req_err.response.json() 
            except: error_body = req_err.response.text
        return jsonify({'error': f'Payment provider communication error: {str(req_err)}', 'details': error_body}), 502 # Bad Gateway
    except Exception as e:
        logger.info(f"Error creating Maxelpay checkout session: {e}")
        return jsonify({'error': f'An internal error occurred during payment processing: {str(e)}'}), 500

# --- End Maxelpay Checkout Route ---

@app.route('/api/maxelpay/webhook', methods=['POST'])
def maxelpay_webhook():
    if db is None:
        logger.info("Webhook Error: Firestore database client not initialized.")
        return jsonify({'status': 'received (internal DB error)'}), 200

    secret = os.environ.get('MAXELPAY_WEBHOOK_SECRET')
    received_signature = request.headers.get('Maxelpay-Signature') or request.headers.get('X-Maxelpay-Signature')
    if not secret or not received_signature or not verify_maxelpay_signature(request.data, received_signature, secret):
        logger.info("Webhook Error: Invalid signature")
        return jsonify({'error': 'Invalid signature'}), 403

    logger.info("Received Maxelpay Webhook:")
    try:
        data = request.json
        logger.info(json.dumps(data, indent=2))

        # 2. Extract Key Information
        order_id = data.get('orderID')
        status = data.get('status') # Verify actual status field name from Maxelpay docs
        # Potentially other useful fields: transactionId, amount, currency, etc.

        if not order_id or not status:
            logger.info("Webhook Error: Missing orderID or status in payload")
            return jsonify({'error': 'Missing required fields'}), 400

        # 3. Update Checkout Session Status (Optional but good practice)
        try:
            session_ref = db.collection('checkout_sessions').document(order_id)
            session_ref.update({
                'status': status,
                'webhookReceivedAt': firestore.SERVER_TIMESTAMP,
                'webhookPayload': data # Store the raw payload for reference
            })
        except Exception as db_error:
             logger.info(f"Webhook Info: Failed to update checkout_sessions doc for {order_id}: {db_error}")
             # Continue processing regardless

        # 4. Process Successful Payment
        # Verify the exact status string indicating success from Maxelpay docs (e.g., 'completed', 'paid', 'success')
        if status.upper() == 'COMPLETED': # Assuming 'COMPLETED' means success
            logger.info(f"Processing successful payment for Order ID: {order_id}")

            # Find the user associated with this order
            checkout_doc = session_ref.get()
            if not checkout_doc.exists:
                 logger.info(f"Webhook Error: Could not find checkout session for order {order_id}")
                 # Decide how to handle - maybe log for manual check?
                 return jsonify({'status': 'received (session not found)'}), 200 # Acknowledge receipt

            user_id = checkout_doc.to_dict().get('userId')
            if not user_id:
                logger.info(f"Webhook Error: Missing userId in checkout session for order {order_id}")
                return jsonify({'status': 'received (user ID missing)'}), 200 # Acknowledge receipt

            # Update the user's profile in Firestore
            try:
                user_ref = db.collection('users').document(user_id)
                user_ref.update({
                    'subscriptionTier': 'paid',
                    'subscriptionStartDate': firestore.SERVER_TIMESTAMP, # Mark start date
                    'lastPaymentOrderId': order_id # Keep track of the last successful order
                    # Optionally clear free scans used:
                    # 'freeScansUsed': 0
                })
                logger.info(f"Successfully updated user {user_id} subscription to 'paid' for order {order_id}")
            except Exception as user_update_error:
                logger.info(f"Webhook Error: Failed to update user profile for user {user_id} (order {order_id}): {user_update_error}")
                # Log this error seriously - payment received but user not upgraded
                # Consider adding to a retry queue or manual alert system
                return jsonify({'error': 'Failed to update user profile'}), 500 # Internal Server Error

        elif status.upper() in ['FAILED', 'CANCELLED', 'EXPIRED']: # Handle other statuses if needed
            logger.info(f"Payment status for Order ID {order_id}: {status}")
            # No user update needed, status already logged in checkout_sessions

        else:
            logger.info(f"Webhook Info: Received unhandled status '{status}' for order {order_id}")


        return jsonify({'status': 'received'}), 200
    except Exception as e:
        logger.info(f"Error processing Maxelpay webhook: {e}")
        return jsonify({'error': 'Failed to process webhook'}), 500
# --- End Webhook Route ---

@app.route('/api/analyze', methods=['POST'])
def analyze_document():
    if db is None:
        logger.info("Error: Firestore database client not initialized.")
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500
    # --- Authorization & Subscription Check --- 
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    user_profile = get_or_create_user_profile(user_id)
    if not user_profile:
         return jsonify({'error': 'Could not retrieve or create user profile.'}), 500

    # --- Monthly Scan Reset Logic ---
    current_month_str = datetime.date.today().strftime('%Y-%m')
    if user_profile.get('lastMonthlyScan') != current_month_str:
        try:
            db.collection('users').document(user_id).update({
                'freeScansUsed': 0,
                'lastMonthlyScan': current_month_str
            })
            user_profile['freeScansUsed'] = 0
            user_profile['lastMonthlyScan'] = current_month_str
            logger.info(f"Monthly scan count reset for user {user_id} for new month {current_month_str}")
        except Exception as e:
            logger.info(f"Error resetting monthly scans for {user_id}: {e}")

    can_analyze = False
    should_increment = False # Unified flag
    tier = user_profile.get('subscriptionTier')
    
    # Get current scan counts
    monthly_scans_used = user_profile.get('freeScansUsed', 0)
    daily_scans_used = user_profile.get('dailyScansUsed', 0)
    last_scan_date = user_profile.get('lastScanDate')
    today_str = datetime.date.today().isoformat()

    # Check if daily count needs reset (for premium tier check)
    if tier == 'premium' and last_scan_date != today_str:
        current_daily_for_check = 0 # Treat as 0 for limit check if date is old
    else:
        current_daily_for_check = daily_scans_used

    # --- Tier Logic --- 
    if tier == 'pro': # New Pro tier
        can_analyze = True
        should_increment = False # Unlimited
        logger.info(f"User {user_id} (Pro) - Access granted (Unlimited)")
    elif tier == 'paid': # Keep existing paid tier logic (assuming unlimited)
        can_analyze = True
        should_increment = False
        logger.info(f"User {user_id} (Paid) - Access granted (Unlimited)")
    elif tier == 'premium': # New Premium tier
        max_monthly_scans = 50 # Defined limit
        max_daily_scans = 3 # Defined limit
        # Check monthly limit
        if monthly_scans_used < max_monthly_scans:
            # Check daily limit
            if current_daily_for_check < max_daily_scans:
                can_analyze = True
                should_increment = True # Increment both monthly and daily
                logger.info(f"User {user_id} (Premium) - Access granted (Monthly: {monthly_scans_used}/{max_monthly_scans}, Daily: {current_daily_for_check}/{max_daily_scans})")
            else:
                logger.info(f"User {user_id} (Premium) Daily scan limit reached ({current_daily_for_check}/{max_daily_scans})")
                return jsonify({'error': f'Daily analysis limit ({max_daily_scans}) reached for Premium plan.', 'limitReached': 'daily'}), 429 # Too Many Requests
        else:
             logger.info(f"User {user_id} (Premium) Monthly scan limit reached ({monthly_scans_used}/{max_monthly_scans})")
             return jsonify({'error': f'Monthly analysis limit ({max_monthly_scans}) reached for Premium plan. Upgrade or wait until next cycle.', 'limitReached': 'monthly'}), 429 # Too Many Requests
    elif tier == 'commercial':
        max_scans = user_profile.get('maxAllowedScans', 0)
        if max_scans <= 0:
            logger.info(f"User {user_id} (Commercial) has max scans set to {max_scans}. Denying access.")
            return jsonify({'error': 'Commercial plan has no scans allowed. Contact admin.', 'upgradeRequired': False}), 403
        if monthly_scans_used < max_scans:
            can_analyze = True
            should_increment = True # Increment monthly count
            logger.info(f"User {user_id} (Commercial) - Access granted ({monthly_scans_used}/{max_scans})")
        else:
            logger.info(f"User {user_id} (Commercial) scan limit reached ({monthly_scans_used}/{max_scans}).")
            return jsonify({'error': f'Commercial scan limit reached ({monthly_scans_used}/{max_scans} used). Contact admin for more.', 'limitReached': 'monthly'}), 429
    elif tier == 'free':
        free_limit = 3
        if monthly_scans_used < free_limit:
            can_analyze = True
            should_increment = True # Increment monthly count
            logger.info(f"User {user_id} (Free) - Access granted ({monthly_scans_used}/{free_limit})")
        else:
             logger.info(f"User {user_id} (Free) scan limit reached ({monthly_scans_used}/{free_limit}).")
             return jsonify({'error': 'Free analysis limit reached. Please upgrade.', 'upgradeRequired': True, 'limitReached': 'monthly'}), 429
    else:
        # Unknown subscription tier
        logger.info(f"User {user_id} has unknown subscription tier: {tier}")
        return jsonify({'error': 'Invalid subscription status.'}), 403
        
    if not can_analyze:
         # Fallback denial
         logger.info(f"User {user_id} (Tier: {tier}) - Access denied (Fallback check)")
         return jsonify({'error': 'Analysis not permitted with current subscription.'}), 403
    # --- End Authorization & Subscription Check ---

    text = None
    file_content_type = None
    original_filename = "Uploaded File" # Default name

    # Try getting file first
    if 'leaseFile' in request.files:
        file = request.files['leaseFile']
        original_filename = file.filename or original_filename
        file_content_type = file.content_type
        
        if file_content_type == 'application/pdf':
            # Read file stream into memory for PyPDF2
            file_stream = io.BytesIO(file.read())
            text = extract_pdf_rich_content(file_stream) # Use the new rich content extractor
            if text is None:
                 return jsonify({'error': 'Failed to extract text from PDF'}), 500
        elif file_content_type == 'text/plain':
            try:
                text = file.read().decode('utf-8')
            except Exception as e:
                logger.info(f"Error reading text file: {e}")
                return jsonify({'error': 'Failed to read text file'}), 500
        else:
            return jsonify({'error': 'Unsupported file type. Please upload PDF or TXT.'}), 400

    # If no file, try getting text from JSON body
    elif request.is_json and 'text' in request.json:
        text = request.json['text']
        original_filename = "Pasted Text"
        # Add input validation for text length
        if len(text) > MAX_TEXT_LENGTH:
            logger.info(f"Input text too long: {len(text)} characters")
            return jsonify({'error': f'Pasted text exceeds the maximum length of {MAX_TEXT_LENGTH} characters.'}), 413 # Payload Too Large
        if not text.strip(): # Check if text is just whitespace
             return jsonify({'error': 'Pasted text cannot be empty.'}), 400
    
    # If neither file nor text provided
    if text is None:
        return jsonify({'error': 'No file or text provided for analysis'}), 400

    # Analyze the extracted/provided text
    try:
        analysis_result_text = analyze_lease(text)
        if not analysis_result_text:
            return jsonify({'error': 'AI analysis failed. Please try again later.'}), 500
        
        # Parse the JSON response from Gemini
        try:
            # Gemini might return markdown ```json ... ```
            cleaned_text = analysis_result_text.strip().lstrip('```json').rstrip('```')
            result_data = json.loads(cleaned_text)
        except json.JSONDecodeError as json_err:
            logger.info(f"JSON Decode Error: {json_err}")
            logger.info(f"Raw Gemini Response: {analysis_result_text}")
            # If response is not valid JSON, wrap raw text
            result_data = {
                'raw_analysis': analysis_result_text,
                'error_message': 'Analysis result was not valid JSON.'
            }
        except Exception as parse_err: # Catch other potential parsing errors
            logger.info(f"Parsing Error: {parse_err}")
            result_data = {
                'raw_analysis': analysis_result_text,
                'error_message': 'An error occurred while parsing the analysis result.'
            }

        # --- NEW: Compliance Analysis Step ---
        if tier == 'commercial' and user_profile.get('complianceTemplate'):
            logger.info(f"User {user_id} is commercial with a template. Running compliance check.")
            template_info = user_profile['complianceTemplate']
            storage_path = template_info.get('storagePath')
            
            if storage_path:
                try:
                    bucket = storage.bucket()
                    blob = bucket.blob(storage_path)
                    template_bytes = blob.download_as_bytes()
                    template_text = extract_pdf_rich_content(io.BytesIO(template_bytes))

                    if template_text:
                        logger.info("Successfully extracted text from master template. Analyzing compliance...")
                        compliance_result = analyze_compliance(text, template_text)
                        # Merge the compliance report into the main analysis result
                        result_data.update(compliance_result)
                    else:
                        logger.info("Warning: Could not extract text from the stored master template.")
                except Exception as e:
                    logger.info(f"CRITICAL: Failed to download or process compliance template for user {user_id}: {e}")
                    # Optionally add an error to the report
                    result_data['compliance_report'] = {
                        "summary": "Error: Could not process the master compliance template.",
                        "deviations": [],
                        "missing_clauses": []
                    }
        # --- End Compliance Analysis Step ---

        # --- Increment scan counts if needed --- 
        if should_increment:
            # Use the new function and pass the tier
            if not increment_scan_counts(user_id, tier):
                 # Log error but proceed - analysis was done, just count failed
                 logger.info(f"CRITICAL: Failed to increment scan counts for user {user_id} (tier: {tier}) after successful analysis.")
                 # Consider adding to a retry queue or alert system
        # --- End Increment --- 

        # Save result to Firestore (as before, creating new doc)
        new_lease_id = None
        try:
            lease_ref = db.collection('leases').add({
                'userId': user_id,
                'fileName': original_filename, # Use original filename or default
                # 'filePath': None, # No longer storing path
                # 'fileUrl': None, # No longer storing URL
                'status': 'complete' if 'error_message' not in result_data else 'error',
                'analysis': result_data,
                'createdAt': firestore.SERVER_TIMESTAMP # Use server timestamp
            })
            new_lease_id = lease_ref[1].id # Get the ID of the newly created doc
        except Exception as db_error:
            logger.info(f"Firestore saving error: {db_error}")
            # Decide if we should fail the request or just return the analysis without saving
            new_lease_id = None # Indicate saving failed
        
        # Return analysis result (and optionally the new lease ID)
        return jsonify({
            'success': True,
            'leaseId': new_lease_id, # Return the ID of the *newly created* doc
            'analysis': result_data
        })
    
    except Exception as e:
        logger.info(f"Analysis endpoint error: {e}")
        # Attempt to save error state if possible (might fail if analysis failed early)
        # We don't have a lease_id readily available here unless we create it earlier
        # For simplicity now, just return the error
        return jsonify({'error': str(e)}), 500

# --- Add DELETE Endpoint --- 
@app.route('/api/leases/<string:lease_id>', methods=['DELETE'])
def delete_lease(lease_id):
    if db is None:
        logger.info("Error: Firestore database client not initialized.")
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500
    # Check authorization
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    if not lease_id:
        return jsonify({'error': 'Missing lease ID'}), 400

    try:
        lease_ref = db.collection('leases').document(lease_id)
        lease_doc = lease_ref.get()

        if not lease_doc.exists:
            return jsonify({'error': 'Lease analysis not found'}), 404

        # Security Check: Ensure the user requesting delete owns the document
        if lease_doc.to_dict().get('userId') != user_id:
            logger.info(f"Unauthorized delete attempt: User {user_id} tried to delete lease {lease_id} owned by {lease_doc.to_dict().get('userId')}")
            return jsonify({'error': 'Forbidden'}), 403

        # Delete the document from Firestore
        lease_ref.delete()

        # Optionally: Delete corresponding file from Firebase Storage if applicable
        # file_path = lease_doc.to_dict().get('filePath')
        # if file_path:
        #    try:
        #        bucket = storage.bucket() # Get bucket reference if needed
        #        blob = bucket.blob(file_path)
        #        blob.delete()
        #        logger.info(f"Deleted storage file: {file_path}")
        #    except Exception as storage_err:
        #        logger.info(f"Error deleting storage file {file_path}: {storage_err}") 
        #        # Continue even if storage delete fails, Firestore doc is main record

        return jsonify({'success': True, 'message': 'Lease analysis deleted successfully'}), 200

    except Exception as e:
        logger.info(f"Error deleting lease {lease_id}: {e}")
        return jsonify({'error': 'An error occurred while deleting the analysis'}), 500
# --- End DELETE Endpoint --- 

# --- Admin Routes --- 

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # 1. Verify Auth Token
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized: Missing or invalid token'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Unauthorized: Invalid token'}), 401

    # 2. Check if the user is the admin
    if not is_admin(user_id):
        logger.info(f"Forbidden access attempt to /api/admin/users by user: {user_id}")
        return jsonify({'error': 'Forbidden: Admin access required'}), 403

    # 3. Fetch users from Firestore
    try:
        users_ref = db.collection('users')
        all_users_docs = users_ref.stream()
        users_list = []
        for doc in all_users_docs:
            user_data = doc.to_dict()
            user_data['userId'] = doc.id # Ensure userId is included
            # Optionally fetch email from Firebase Auth if not stored in profile
            try:
                auth_user = firebase_admin.auth.get_user(doc.id)
                user_data['email'] = auth_user.email
            except Exception as auth_err:
                logger.info(f"Could not fetch email for user {doc.id}: {auth_err}")
                user_data['email'] = user_data.get('email', 'N/A') # Use stored email or N/A
            
            # Convert Timestamps to strings for JSON serialization if necessary
            if 'createdAt' in user_data and isinstance(user_data['createdAt'], firestore.SERVER_TIMESTAMP.__class__):
                 # Handle uncommitted server timestamps if needed, or skip/format
                 user_data['createdAt'] = None # Or format if available after get()
            elif 'createdAt' in user_data and hasattr(user_data['createdAt'], 'isoformat'):
                 user_data['createdAt'] = user_data['createdAt'].isoformat()
            # Add similar handling for other timestamp fields like 'subscriptionStartDate'

            users_list.append(user_data)
            
        return jsonify(users_list), 200
    except Exception as e:
        logger.info(f"Error fetching users from Firestore: {e}")
        return jsonify({'error': 'Failed to retrieve users'}), 500

@app.route('/api/admin/set-scans', methods=['POST'])
def set_user_scans():
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # 1. Verify Auth Token & Admin Status
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized: Missing or invalid token'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id or not is_admin(user_id):
        return jsonify({'error': 'Forbidden: Admin access required'}), 403

    # 2. Get Data from Request
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing request body'}), 400
        
    target_user_id = data.get('targetUserId')
    scan_limit_input = data.get('scanLimit')

    if not target_user_id:
        return jsonify({'error': 'Missing targetUserId'}), 400
    if scan_limit_input is None: # Allow 0, check specifically for None
        return jsonify({'error': 'Missing scanLimit'}), 400
        
    try:
        # Ensure scan_limit is a non-negative integer
        scan_limit = int(scan_limit_input)
        if scan_limit < 0:
            raise ValueError("Scan limit cannot be negative.")
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid scanLimit: must be a non-negative integer.'}), 400

    # 3. Update Firestore
    try:
        user_ref = db.collection('users').document(target_user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({'error': 'Target user not found'}), 404
            
        # Set the maxAllowedScans field
        # Decide if freeScansUsed should be reset - let's not reset for now
        user_ref.update({
            'maxAllowedScans': scan_limit
            # Optionally update tier if setting scans implies a specific tier
            # 'subscriptionTier': 'commercial' # Or another tier name
        })
        
        logger.info(f"Admin {user_id} set scan limit for user {target_user_id} to {scan_limit}")
        return jsonify({'success': True, 'message': f'Scan limit updated to {scan_limit} for user {target_user_id}'}), 200
        
    except Exception as e:
        logger.info(f"Error updating scan limit for {target_user_id}: {e}")
        return jsonify({'error': 'Failed to update user scan limit'}), 500
        
@app.route('/api/admin/create-commercial', methods=['POST'])
def create_commercial_user():
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # 1. Verify Auth Token & Admin Status
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized: Missing or invalid token'}), 401
    token = auth_header.split('Bearer ')[1]
    requesting_user_id = verify_token(token)
    if not requesting_user_id or not is_admin(requesting_user_id):
        return jsonify({'error': 'Forbidden: Admin access required'}), 403

    # 2. Get Data from Request
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing request body'}), 400
        
    email = data.get('email')
    password = data.get('password')
    scan_limit_input = data.get('scanLimit')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
    if scan_limit_input is None:
        return jsonify({'error': 'Missing scanLimit'}), 400
        
    try:
        scan_limit = int(scan_limit_input)
        if scan_limit < 0:
            raise ValueError("Scan limit cannot be negative.")
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid scanLimit: must be a non-negative integer.'}), 400
        
    # 3. Create User in Firebase Auth
    new_user_uid = None
    try:
        new_user = firebase_admin.auth.create_user(
            email=email,
            password=password,
            email_verified=True # Optional: mark as verified since admin created
        )
        new_user_uid = new_user.uid
        logger.info(f"Admin {requesting_user_id} created new Auth user {email} ({new_user_uid})")
    except firebase_admin.auth.EmailAlreadyExistsError:
        logger.info(f"Failed to create user: Email {email} already exists.")
        return jsonify({'error': 'Email already exists'}), 409 # Conflict
    except Exception as e:
        logger.info(f"Error creating Firebase Auth user {email}: {e}")
        return jsonify({'error': 'Failed to create user authentication'}), 500
        
    # 4. Create User Profile in Firestore
    if new_user_uid:
        try:
            user_ref = db.collection('users').document(new_user_uid)
            profile_data = {
                'userId': new_user_uid,
                'email': email, 
                'subscriptionTier': 'commercial', # Assign specific tier
                'maxAllowedScans': scan_limit,
                'freeScansUsed': 0, # Start with 0 used
                'createdAt': firestore.SERVER_TIMESTAMP,
                'lastMonthlyScan': datetime.date.today().strftime('%Y-%m')
            }
            user_ref.set(profile_data)
            logger.info(f"Created Firestore profile for commercial user {email} ({new_user_uid}) with scan limit {scan_limit}")
            return jsonify({
                'success': True, 
                'message': 'Commercial user created successfully', 
                'userId': new_user_uid, 
                'email': email
            }), 201 # Created
        except Exception as e:
            logger.info(f"CRITICAL: Failed to create Firestore profile for user {new_user_uid} after Auth creation: {e}")
            # Consider deleting the Auth user here or adding manual cleanup process
            return jsonify({'error': 'User authentication created, but failed to create user profile data.'}), 500
    else:
        # Should not happen if Auth creation didn't error, but as fallback
        return jsonify({'error': 'Failed to get new user ID after creation'}), 500

# --- End Admin Routes --- 

# --- NEW: Commercial Analytics Endpoint ---
@app.route('/api/commercial/analytics', methods=['GET'])
def get_commercial_analytics():
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # 1. --- Authorization & Subscription Check ---
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    user_profile = get_or_create_user_profile(user_id)
    if not user_profile or user_profile.get('subscriptionTier') != 'commercial':
        logger.info(f"Forbidden access attempt to /api/commercial/analytics by user: {user_id}")
        return jsonify({'error': 'Forbidden: Commercial access required'}), 403

    # 2. --- Data Fetching ---
    try:
        leases_query = db.collection('leases').where('userId', '==', user_id)
        all_leases_docs = list(leases_query.stream()) # Use list to iterate multiple times
        
        if not all_leases_docs:
            return jsonify({
                'averageRiskScore': 0,
                'riskiestLeases': [],
                'commonClauses': [],
                'upcomingExpiries': []
            }), 200

    except Exception as e:
        logger.info(f"Error fetching leases for commercial analytics (user: {user_id}): {e}")
        return jsonify({'error': 'Failed to retrieve lease data for analytics.'}), 500

    # 3. --- Data Processing & Calculations ---
    try:
        total_score = 0
        valid_leases_for_score = 0
        lease_risks = []
        clause_counts = {}
        upcoming_expiries = []
        
        ninety_days_from_now = datetime.date.today() + datetime.timedelta(days=90)

        for doc in all_leases_docs:
            lease_data = doc.to_dict()
            analysis = lease_data.get('analysis', {})
            
            # --- Risk Score Calculation ---
            score = analysis.get('score')
            if isinstance(score, int) or isinstance(score, float):
                total_score += score
                valid_leases_for_score += 1
                lease_risks.append({
                    'name': lease_data.get('fileName', f'Lease {doc.id}'),
                    'score': score
                })

            # --- Common Clause Counting ---
            risks = analysis.get('risks', [])
            if isinstance(risks, list):
                for risk_description in risks:
                    clause_counts[risk_description] = clause_counts.get(risk_description, 0) + 1

            # --- Expiry Date Calculation ---
            end_date_str = analysis.get('extracted_data', {}).get('Lease_End_Date')
            if end_date_str and end_date_str != "Not Found":
                try:
                    # Handle various date formats gracefully
                    end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
                    if end_date <= ninety_days_from_now and end_date >= datetime.date.today():
                        upcoming_expiries.append({
                            'name': lease_data.get('fileName', f'Lease {doc.id}'),
                            'date': end_date.isoformat()
                        })
                except (ValueError, TypeError):
                    logger.info(f"Could not parse date '{end_date_str}' for lease {doc.id}")


        # --- Final Data Aggregation ---
        average_risk_score = round(total_score / valid_leases_for_score) if valid_leases_for_score > 0 else 0
        
        # Sort and get top 5 riskiest leases (lower score is riskier)
        riskiest_leases = sorted(lease_risks, key=lambda x: x['score'])[:5]
        
        # Sort and get top 5 common clauses
        sorted_clauses = sorted(clause_counts.items(), key=lambda item: item[1], reverse=True)
        common_clauses = [{'name': name, 'count': count} for name, count in sorted_clauses[:5]]

        # Sort upcoming expiries by date
        sorted_expiries = sorted(upcoming_expiries, key=lambda x: x['date'])

        # 4. --- Response ---
        return jsonify({
            'averageRiskScore': average_risk_score,
            'riskiestLeases': riskiest_leases,
            'commonClauses': common_clauses,
            'upcomingExpiries': sorted_expiries
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.info(f"Error processing analytics data for user {user_id}: {e}")
        return jsonify({'error': 'An error occurred while processing analytics data.'}), 500

# --- End Commercial Analytics Endpoint ---


# --- NEW: Compliance Template Management Endpoints ---

@app.route('/api/compliance/template', methods=['GET'])
def get_compliance_template():
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # Authorization & Subscription Check
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id: return jsonify({'error': 'Invalid token'}), 401

    user_profile = get_or_create_user_profile(user_id)
    if user_profile.get('subscriptionTier') != 'commercial':
        return jsonify({'error': 'Forbidden: Commercial access required'}), 403

    template_info = user_profile.get('complianceTemplate')
    if template_info:
        return jsonify(template_info), 200
    else:
        return jsonify({'message': 'No template found'}), 404

@app.route('/api/compliance/template', methods=['POST'])
def upload_compliance_template():
    if db is None: return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # Authorization & Subscription Check
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id: return jsonify({'error': 'Invalid token'}), 401

    user_profile = get_or_create_user_profile(user_id)
    if user_profile.get('subscriptionTier') != 'commercial':
        return jsonify({'error': 'Forbidden: Commercial access required'}), 403

    if 'templateFile' not in request.files:
        return jsonify({'error': 'No template file provided'}), 400
    
    file = request.files['templateFile']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Define the storage path
        storage_path = f"compliance_templates/{user_id}/master_template"
        bucket = storage.bucket()
        blob = bucket.blob(storage_path)

        # Upload the file
        blob.upload_from_file(file.stream, content_type=file.content_type)
        
        # Update user's profile in Firestore
        template_info = {
            'fileName': file.filename,
            'storagePath': storage_path,
            'uploadedAt': firestore.SERVER_TIMESTAMP
        }
        user_ref = db.collection('users').document(user_id)
        user_ref.update({'complianceTemplate': template_info})

        return jsonify({'success': True, 'template': {'fileName': file.filename}}), 200

    except Exception as e:
        logger.info(f"Error uploading compliance template for user {user_id}: {e}")
        return jsonify({'error': 'Failed to upload template.'}), 500

@app.route('/api/compliance/template', methods=['DELETE'])
def delete_compliance_template():
    if db is None: return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # Authorization & Subscription Check
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id: return jsonify({'error': 'Invalid token'}), 401

    user_profile = get_or_create_user_profile(user_id)
    if user_profile.get('subscriptionTier') != 'commercial':
        return jsonify({'error': 'Forbidden: Commercial access required'}), 403

    template_info = user_profile.get('complianceTemplate')
    if not template_info:
        return jsonify({'error': 'No template found to delete'}), 404

    try:
        # Delete from Firebase Storage
        storage_path = template_info.get('storagePath')
        if storage_path:
            bucket = storage.bucket()
            blob = bucket.blob(storage_path)
            if blob.exists():
                blob.delete()

        # Remove from user's profile in Firestore
        user_ref = db.collection('users').document(user_id)
        user_ref.update({'complianceTemplate': firestore.DELETE_FIELD})

        return jsonify({'success': True}), 200

    except Exception as e:
        logger.info(f"Error deleting compliance template for user {user_id}: {e}")
        return jsonify({'error': 'Failed to delete template.'}), 500

# --- End Compliance Template Management Endpoints ---


# --- NEW: Photo Inspection Endpoint ---
def allowed_image_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

@app.route('/api/inspect-photos', methods=['POST'])
def inspect_photos():
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # --- Authorization --- 
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    # --- File Handling ---
    if 'photos' not in request.files:
        return jsonify({'error': 'No photo files provided'}), 400

    uploaded_files = request.files.getlist('photos')

    if not uploaded_files or len(uploaded_files) == 0 or uploaded_files[0].filename == '':
         return jsonify({'error': 'No photos selected for upload'}), 400

    all_results = [] # Store results for all images
    all_issues = [] # Store issues across all images for cost estimate

    # --- Gemini Vision Analysis Logic ---
    for file in uploaded_files:
        if not file or not allowed_image_file(file.filename):
            logger.warning(f"Skipped invalid file type: {file.filename}")
            continue

        if not file.mimetype.startswith('image/'):
            logger.warning(f"Rejected non-image MIME type: {file.mimetype}")
            continue

        file.stream.seek(0, os.SEEK_END)
        size = file.stream.tell()
        file.stream.seek(0)
        if size > MAX_IMAGE_SIZE_BYTES:
            return jsonify({'error': f'File {file.filename} exceeds size limit of {MAX_IMAGE_SIZE_MB}MB'}), 400

        logger.info(f"Processing photo for inspection: {file.filename}")
        try:
            image_bytes = file.read()
            mime_type = mimetypes.guess_type(file.filename)[0]
            if not mime_type or not mime_type.startswith('image/'):
                logger.warning(f"Skipping file with undetermined or non-image MIME type: {file.filename}")
                continue
                
            # Prepare image part for Gemini
            image_part = {
                "mime_type": mime_type,
                "data": image_bytes
            }
            
            # Construct the prompt for Gemini Vision
            prompt = f"""\
            Analyze the provided image of a property (wall, fixture, roof, etc.). 
            Identify and describe any visible damage, defects, or potential issues (e.g., cracks, stains, rust, holes, wear and tear, water damage, mold). 
            For each distinct issue found, provide:
            1. A short label (e.g., 'Hairline Crack', 'Water Stain', 'Minor Corrosion').
            2. An estimated severity level (Low, Medium, High).
            3. A brief description or location if possible.
            
            Format the output ONLY as a single JSON object containing a key called 'identified_issues\'. 
            The value of 'identified_issues\' should be an array of objects, where each object represents a found issue and has the keys: 'label\', 'severity\', and 'description\'.
            If no issues are found, return an empty array: {{"identified_issues": []}}
            Do not include any text before or after the JSON object (e.g., no ```json markdown).
            """

            analysis_result_json = None
            last_error = None
            # Iterate through API keys (similar to analyze_lease)
            for i, api_key in enumerate(gemini_api_keys):
                logger.info(f"Attempting Gemini Vision with API key #{i+1} for {file.filename}")
                try:
                    genai.configure(api_key=api_key)
                    # Use a model that supports vision, e.g., gemini-pro-vision or 1.5 flash/pro
                    model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20') 
                    
                    # Generate content with prompt and image
                    response = model.generate_content([prompt, image_part])
                    
                    # Clean and parse the response
                    cleaned_text = response.text.strip().lstrip('```json').rstrip('```').strip()
                    analysis_result_json = json.loads(cleaned_text)
                    
                    logger.info(f"Gemini Vision successful with API key #{i+1} for {file.filename}")
                    break # Success, exit key loop
                    
                except json.JSONDecodeError as json_err:
                    logger.info(f"JSON Decode Error (key #{i+1}) for {file.filename}: {json_err}")
                    logger.info(f"Raw Gemini Response: {response.text}")
                    last_error = json_err # Store error and try next key
                    continue
                except PermissionDenied as e:
                    if "API key not valid" in str(e) or "invalid" in str(e).lower():
                        logger.info(f"Warning: Gemini API key #{i+1} failed (Invalid Key): {e}")
                        last_error = e
                        continue # Try next key
                    else:
                        logger.info(f"Gemini API Permission Error (key #{i+1}) for {file.filename}: {e}")
                        last_error = e
                        break # Non-key permission error, stop trying
                except GoogleAPIError as e: 
                    logger.info(f"Gemini API Error (key #{i+1}) for {file.filename}: {e}")
                    last_error = e
                    # Potentially retry on specific errors like rate limits, but stop for now
                    break
                except Exception as e:
                    logger.info(f"Unexpected Error during Gemini vision (key #{i+1}) for {file.filename}: {e}")
                    last_error = e
                    break # Stop on unexpected errors

            # Process results if analysis was successful
            found_issues = []
            if analysis_result_json and 'identified_issues' in analysis_result_json:
                # Basic validation: ensure it's a list
                if isinstance(analysis_result_json['identified_issues'], list):
                    for issue in analysis_result_json['identified_issues']:
                        # Basic validation of issue structure
                        if isinstance(issue, dict) and 'label' in issue and 'severity' in issue and 'description' in issue:
                            issue_id = f"issue-{uuid.uuid4()}" # Generate unique ID
                            validated_issue = {
                                'id': issue_id,
                                'label': issue.get('label', 'Unknown'),
                                'severity': issue.get('severity', 'Unknown'),
                                'location': issue.get('description', 'N/A') # Use description as location for now
                            }
                            found_issues.append(validated_issue)
                            all_issues.append(validated_issue) # Add to overall list for estimate
                        else:
                            logger.info(f"Warning: Skipping malformed issue object in response for {file.filename}: {issue}")
                else:
                     logger.info(f"Warning: 'identified_issues' is not a list in response for {file.filename}")
            elif last_error:
                 logger.info(f"Gemini Vision failed for {file.filename} after trying all keys. Last error: {last_error}")
                 # Optionally add an error marker to the result for this file
            else:
                 logger.info(f"No issues identified or analysis failed for {file.filename}")
                 
            all_results.append({
                "fileName": file.filename,
                "imageUrl": "placeholder", # Replace if storing and serving images
                "issues": found_issues, # Issues found for THIS image
                "analysis_error": str(last_error) if last_error and not analysis_result_json else None # Include error if analysis failed
            })

        except Exception as file_proc_err:
             logger.info(f"Error processing file {file.filename}: {file_proc_err}")
             # Add a result indicating this file failed processing
             all_results.append({
                "fileName": file.filename,
                "imageUrl": "placeholder",
                "issues": [],
                "processing_error": str(file_proc_err)
             })
    # --- End Gemini Vision Analysis Logic ---

    # --- Mock Repair Estimate (Based on combined issues) ---
    total_cost = 0
    line_items = []
    for issue in all_issues: # Iterate through issues from ALL processed images
        cost = 50 # Default mock cost
        if issue['severity'] == "Medium": cost = 150
        if issue['severity'] == "High": cost = 300
        line_items.append({ 'issueId': issue['id'], 'task': f"Repair {issue['label']}", 'estimatedCost': cost })
        total_cost += cost

    final_estimate = {
        "lineItems": line_items,
        "totalEstimatedCost": total_cost,
        "notes": "AI-based issue detection complete. Cost estimates are placeholders."
    }
    # --- End Mock Estimate ---

    # --- Save to Firestore ---
    inspection_id = None
    try:
        inspection_ref = db.collection('inspections').add({
            'userId': user_id,
            'status': 'complete', # Or indicate partial success if some files failed
            'results': all_results,
            'repairEstimate': final_estimate,
            'createdAt': firestore.SERVER_TIMESTAMP
        })
        inspection_id = inspection_ref[1].id
        logger.info(f"Saved inspection {inspection_id} for user {user_id}")
    except Exception as db_error:
        logger.info(f"Firestore saving error for inspection (user {user_id}): {db_error}")
        # Proceed without saving, but log the error
    # --- End Save to Firestore ---

    return jsonify({
        'success': True, # Indicate endpoint success, individual files might have errors
        'results': all_results, # Contains results per file, including potential errors
        'repairEstimate': final_estimate,
        'inspectionId': inspection_id # Return the ID if saved
    }), 200

# --- End Photo Inspection Endpoint ---

# --- NEW: Finance Analysis Endpoint ---
def allowed_finance_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_FINANCE_EXTENSIONS

@app.route('/api/scan-expense', methods=['POST'])
def scan_expense_documents():
    if db is None:
        return jsonify({'error': 'Server configuration error: Database unavailable.'}), 500

    # --- Authorization ---
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    # --- File Handling ---
    if 'documents' not in request.files:
        return jsonify({'error': 'No document files provided'}), 400

    uploaded_files = request.files.getlist('documents')
    if not uploaded_files or uploaded_files[0].filename == '':
        return jsonify({'error': 'No files selected for upload'}), 400

    all_extracted_data = []
    processing_errors = []

    for file in uploaded_files:
        try:
            if not file or not allowed_finance_file(file.filename):
                logger.info(f"Skipped invalid file type: {file.filename}")
                continue

            logger.info(f"Processing expense document: {file.filename}")
            file.seek(0)
            file_bytes = file.read()
            mime_type = mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'
            
            text_content = None
            image_fallback_bytes = None  # If we need to send an image instead of text
            if mime_type == 'application/pdf':
                # First attempt to extract text (including OCR)
                text_content = extract_pdf_rich_content(io.BytesIO(file_bytes))
                # If no meaningful text, fall back to image conversion for the first page
                if not text_content or len(text_content.strip()) < 40:
                    try:
                        from pdf2image import convert_from_bytes
                        images = convert_from_bytes(file_bytes, first_page=1, last_page=1)
                        if images:
                            img_io = io.BytesIO()
                            images[0].save(img_io, format='PNG')
                            image_fallback_bytes = img_io.getvalue()
                            mime_type = 'image/png'  # Treat as image for downstream logic
                            logger.info(f"Falling back to image analysis for {file.filename} (first page converted to PNG).")
                        else:
                            raise ValueError("PDF to image conversion produced no pages.")
                    except Exception as img_err:
                        raise ValueError(f"Failed both text extraction and image fallback: {img_err}")
            elif mime_type.startswith('image/'):
                # This is handled later by sending the image data directly
                pass
            else:
                # For other text-based files if any
                text_content = file_bytes.decode('utf-8')

            prompt = """Analyze the provided financial document (e.g., receipt, invoice).
Extract all key financial details. The output MUST be a single JSON object.
Key details to extract include:
- `vendor`: The merchant or store name.
- `transaction_date`: The date of the transaction (YYYY-MM-DD).
- `line_items`: An array of objects, each with `description` and `amount`.
- `subtotal`: The total before tax.
- `tax`: The total tax amount.
- `total`: The final total amount.
- `category`: A suggested expense category (e.g., "Office Supplies", "Meals", "Travel").

If a field is not present, omit it from the JSON.
The final `total` is the most important field.
Return ONLY the JSON object. Do not include ```json markdown or any other text.
If the document is not a receipt/invoice or is unreadable, return an empty JSON object: {}
"""
            if text_content:
                prompt += "\n\n" + text_content[:MAX_TEXT_LENGTH]

            analysis_result_json = None
            last_error = None

            for i, api_key in enumerate(gemini_api_keys):
                logger.info(f"Attempting Expense Analysis with API key #{i+1} for {file.filename}")
                try:
                    genai.configure(api_key=api_key)
                    model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20')
                    if mime_type.startswith('image/'):
                        # Use fallback image bytes if we created one, otherwise use original bytes
                        img_bytes = image_fallback_bytes or file_bytes
                        document_part = {"mime_type": mime_type, "data": img_bytes}
                        response = model.generate_content([prompt, document_part])
                    else:
                        response = model.generate_content(prompt)

                    if not response.text:
                        raise ValueError("The AI model returned an empty response.")

                    cleaned_text = response.text.strip().lstrip('```json').rstrip('```').strip()
                    analysis_result_json = json.loads(cleaned_text)
                    # Treat an empty JSON object (i.e. {}) as a failure so we can retry with the next key
                    if isinstance(analysis_result_json, dict) and len(analysis_result_json) == 0:
                        raise ValueError("The AI model returned an empty JSON object (no data extracted).")
                    logger.info(f"Expense Analysis successful for {file.filename}")
                    last_error = None
                    break
                except Exception as e:
                    last_error = e
                    logger.info(f"Error with API key #{i+1} for {file.filename}: {e}")
                    continue

            if analysis_result_json:
                analysis_result_json['fileName'] = file.filename
                all_extracted_data.append(analysis_result_json)
            else:
                error_message = f"Analysis failed for {file.filename}. Last error: {last_error}"
                logger.info(error_message)
                processing_errors.append({"fileName": file.filename, "error": str(last_error)})

        except Exception as file_proc_err:
             logger.info(f"Error processing file {file.filename}: {file_proc_err}")
             import traceback
             traceback.print_exc()
             processing_errors.append({
                "fileName": file.filename,
                "error": f"Critical error processing file: {file_proc_err}"
             })

    # --- Save to Firestore ---
    saved_expense_ids = []
    if all_extracted_data:
        logger.info(f"Saving {len(all_extracted_data)} successfully extracted expense documents.")
        for data in all_extracted_data:
            try:
                expense_ref = db.collection('expenses').add({
                    'userId': user_id,
                    'fileName': data.get('fileName', 'Unknown'),
                    'status': 'complete',
                    'extractedData': data,
                    'createdAt': firestore.SERVER_TIMESTAMP
                })
                expense_id = expense_ref[1].id
                saved_expense_ids.append(expense_id)
            except Exception as db_error:
                logger.info(f"Firestore saving error for expense: {db_error}")
                processing_errors.append({"fileName": data.get('fileName', 'Unknown'), "error": f"Database save failed: {db_error}"})

    # --- Final Response ---
    response_payload = {
        'success': len(all_extracted_data) > 0,
        'extractedDataList': all_extracted_data,
        'errors': processing_errors,
        'savedExpenseIds': saved_expense_ids
    }

    status_code = 200
    if processing_errors and all_extracted_data:
        status_code = 207  # Multi-Status
    elif processing_errors and not all_extracted_data:
        status_code = 200 # <-- This was 500. Changed to 200 to not trigger a hard error on the frontend.

    return jsonify(response_payload), status_code

# --- End Expense Scanning Endpoint --- # Corrected closing comment

# --- NEW: Lease Calculator Endpoint ---
@app.route('/api/calculate-lease', methods=['POST'])
def calculate_lease_costs():
    # Optional: Add authentication if needed
    # auth_header = request.headers.get('Authorization')
    # if not auth_header or not auth_header.startswith('Bearer '):
    #     return jsonify({'error': 'Unauthorized'}), 401
    # token = auth_header.split('Bearer ')[1]
    # user_id = verify_token(token)
    # if not user_id:
    #     return jsonify({'error': 'Invalid token'}), 401

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing calculation data'}), 400
        
    # --- Input Parameters (Examples - Adjust based on frontend needs) ---
    calculation_type = data.get('type') # e.g., 'rent_increase', 'prorated', 'total_cost'
    base_rent = data.get('baseRent', 0)
    increase_percentage = data.get('increasePercentage', 0)
    start_date_str = data.get('startDate')
    end_date_str = data.get('endDate')
    move_in_date_str = data.get('moveInDate')
    first_payment_date_str = data.get('firstPaymentDate') # e.g., 'YYYY-MM-01'
    rent_due_day = data.get('rentDueDay', 1) # Day of month rent is due
    
    results = {}

    # --- Calculation Logic ---
    try:
        if calculation_type == 'rent_increase':
            if base_rent > 0 and increase_percentage > 0:
                increase_amount = base_rent * (increase_percentage / 100.0)
                new_rent = base_rent + increase_amount
                results = {
                    'increaseAmount': round(increase_amount, 2),
                    'newRent': round(new_rent, 2)
                }
            else:
                 raise ValueError("Base rent and increase percentage must be positive for rent increase calculation.")
                 
        elif calculation_type in ['prorated_rent', 'prorated']:
            # Requires move_in_date, first_payment_date, base_rent
            if not move_in_date_str or not first_payment_date_str or base_rent <= 0:
                 raise ValueError("Move-in date, first payment date, and base rent required for prorated calculation.")
                 
            move_in_date = datetime.datetime.strptime(move_in_date_str, '%Y-%m-%d').date()
            first_payment_date = datetime.datetime.strptime(first_payment_date_str, '%Y-%m-%d').date()
            
            # Find the number of days in the move-in month
            # Correct calculation for days in the month
            next_month = move_in_date.replace(day=28) + datetime.timedelta(days=4) # Go to next month reliably
            days_in_month = (next_month - datetime.timedelta(days=next_month.day)).day
            
            # Calculate days occupied in the first month
            # Use the last day of the move-in month
            days_occupied = (datetime.date(move_in_date.year, move_in_date.month, days_in_month) - move_in_date).days + 1
            
            if days_occupied < 0 or days_occupied > days_in_month:
                 raise ValueError("Invalid date range for prorated calculation.")
            
            prorated_amount = (base_rent / days_in_month) * days_occupied
            
            results = {
                'daysInMonth': days_in_month,
                'daysOccupied': days_occupied,
                'proratedRent': round(prorated_amount, 2)
            }
            
        elif calculation_type in ['total_lease_cost', 'total_cost']:
            # Requires start_date, end_date, base_rent
            if not start_date_str or not end_date_str or base_rent <= 0:
                 raise ValueError("Start date, end date, and base rent required for total cost calculation.")
                 
            start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            # Calculate number of full months (this is approximate, needs refinement for exact days)
            num_months = (end_date.year - start_date.year) * 12 + end_date.month - start_date.month
            # A more precise calculation would involve iterating through months or days
            
            if num_months < 0:
                 raise ValueError("End date must be after start date.")
                 
            # Simple approximation: assumes full months only
            total_rent = base_rent * (num_months + 1) # Add 1 to include start month if simple month count
            
            results = {
                'leaseDurationMonthsApprox': num_months + 1,
                'totalRentApprox': round(total_rent, 2),
                'note': 'Total rent is an approximation based on full months. Prorated amounts not included.'
            }
            
        else:
            return jsonify({'error': 'Invalid calculation type specified'}), 400

        return jsonify({'success': True, 'calculation': results}), 200

    except ValueError as ve:
        return jsonify({'error': f"Invalid input data: {ve}"}), 400
    except Exception as e:
        logger.info(f"Error during lease calculation: {e}")
        return jsonify({'error': 'An unexpected error occurred during calculation.'}), 500
# --- End Lease Calculator Endpoint ---

# --- Reusable Gemini Model Initialization ---
# Store initialized models to potentially reuse them and cycle keys
gemini_models = {}
current_key_index = 0

def get_gemini_model(model_name="gemini-2.5-flash-preview-05-20", temperature=None):
    global current_key_index
    global gemini_models
    global gemini_api_keys

    if not gemini_api_keys:
        raise ValueError("No Gemini API keys configured.")

    # Cycle through keys
    key_to_use = gemini_api_keys[current_key_index]
    current_key_index = (current_key_index + 1) % len(gemini_api_keys)
    
    # Model unique ID now includes temperature if specified, to cache different configurations
    temp_suffix = f"_t{temperature}" if temperature is not None else ""
    model_key_id = f"{model_name}_{current_key_index}{temp_suffix}"

    if model_key_id not in gemini_models:
        logger.info(f"Initializing Gemini model {model_name} with key index {current_key_index} and temperature {temperature or 'default'}")
        genai.configure(api_key=key_to_use)
        
        generation_config = {}
        if temperature is not None:
            generation_config['temperature'] = temperature

        safety_settings = [
            # Your safety settings here...
        ]
        
        model = genai.GenerativeModel(
            model_name, 
            safety_settings=safety_settings,
            generation_config=genai.types.GenerationConfig(**generation_config) if generation_config else None
        )
        gemini_models[model_key_id] = model
        
    return gemini_models[model_key_id]

# --- Analyze Image with Gemini ---
def analyze_image(image_file_storage):
    """Analyzes an uploaded image file using Gemini 2.5 Flash Preview."""
    if not Image:
         raise ImportError("Pillow library is required for image analysis.")
         
    try:
        # Read image bytes ONCE
        image_bytes = image_file_storage.read()
        
        # Use BytesIO for Pillow operations without affecting original bytes
        with io.BytesIO(image_bytes) as image_stream:
            img = Image.open(image_stream) 
            img.verify() # Verify image data integrity
            
            # Get MIME type after verification
            # We might need to reopen from the stream after verify
            image_stream.seek(0) 
            img = Image.open(image_stream) # Re-open to get metadata like format
            mime_type = img.get_format_mimetype() or mimetypes.guess_type(image_file_storage.filename)[0]
            if not mime_type:
                 raise ValueError("Could not determine image MIME type.")

        # Prepare image data for Gemini API using the originally read bytes
        image_parts = [
            {
                "mime_type": mime_type, 
                "data": image_bytes # Use the original bytes
            }
        ]
        
        # Define the prompt for image analysis (adjust as needed)
        prompt = [
             "Analyze the following image, which is related to a real estate property or rental listing. ",
             "Describe the key features visible in the image relevant to a potential tenant or landlord. ",
             "Focus on aspects like room type, condition, amenities shown, style, potential issues, or unique selling points. ",
             "Provide a concise summary.",
             image_parts[0] # Embed the image data directly in the prompt list
        ]

        # Get the Gemini 2.5 Flash Preview model (using the key rotation logic)
        model = get_gemini_model(model_name="gemini-2.5-flash-preview-05-20") # Updated model name

        # Generate content
        logger.info(f"Sending image ({image_parts[0]['mime_type']}) to Gemini 2.5 Flash Preview for analysis...")
        response = model.generate_content(prompt)

        # Check for response and valid text part
        if response and response.parts:
             # Assuming the response structure contains text in parts
             # Corrected line: Ensure the join method has a valid string to join elements
             full_text = "".join(part.text for part in response.parts if hasattr(part, 'text')) 
             if full_text:
                 logger.info("Gemini image analysis successful.")
                 # Try to parse as JSON if the prompt requested it, otherwise return text
                 # For now, just returning the text description.
                 # Modify prompt and this section if structured JSON output is desired.
                 return full_text 
             else:
                 # Handle cases where response exists but has no text (e.g., safety block)
                 logger.info(f"Gemini response missing text. Block reason: {response.prompt_feedback.block_reason if response.prompt_feedback else 'Unknown'}")
                 raise ValueError("Analysis blocked or failed to generate text.")
        else:
            # Handle empty or invalid response object
            logger.info("Gemini returned an empty or invalid response.")
            raise ValueError("Failed to get a valid response from the analysis model.")

    except (genai.types.BlockedPromptException, genai.types.StopCandidateException) as safety_error:
         logger.info(f"Gemini safety block during image analysis: {safety_error}")
         raise ValueError(f"Analysis blocked due to safety settings: {safety_error}")
    except Exception as e:
        logger.info(f"Error during image analysis: {e}")
        # Log the specific error type and message
        logger.info(f"Error type: {type(e).__name__}, Message: {str(e)}")
        raise # Re-raise the exception to be caught by the route handler

# --- New Route for Image Analysis ---
@app.route('/api/analyze-image', methods=['POST'])
def analyze_image_route():
    if db is None:
         return jsonify({"error": "Database not initialized. Cannot process request."}), 503

    # --- Authorization & Subscription Check (Copied & Adapted from /api/analyze) ---
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized: Missing or invalid token'}), 401

    token = auth_header.split('Bearer ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401

    user_profile = get_or_create_user_profile(user_id)
    if not user_profile:
         return jsonify({'error': 'Could not retrieve or create user profile.'}), 500

    # --- Monthly Scan Reset Logic ---
    current_month_str = datetime.date.today().strftime('%Y-%m')
    if user_profile.get('lastMonthlyScan') != current_month_str:
        try:
            db.collection('users').document(user_id).update({
                'freeScansUsed': 0,
                'lastMonthlyScan': current_month_str
            })
            user_profile['freeScansUsed'] = 0
            user_profile['lastMonthlyScan'] = current_month_str
            logger.info(f"Monthly scan count reset for user {user_id} for new month {current_month_str}")
        except Exception as e:
            logger.info(f"Error resetting monthly scans for {user_id}: {e}")

    can_analyze = False
    should_increment = False # Unified flag
    tier = user_profile.get('subscriptionTier')
    
    # Get current scan counts
    monthly_scans_used = user_profile.get('freeScansUsed', 0)
    daily_scans_used = user_profile.get('dailyScansUsed', 0)
    last_scan_date = user_profile.get('lastScanDate')
    today_str = datetime.date.today().isoformat()

    # Check if daily count needs reset (for premium tier check)
    if tier == 'premium' and last_scan_date != today_str:
        current_daily_for_check = 0 # Treat as 0 for limit check if date is old
    else:
        current_daily_for_check = daily_scans_used

    # --- Tier Logic --- 
    if tier == 'pro': # New Pro tier
        can_analyze = True
        should_increment = False # Unlimited
        logger.info(f"User {user_id} (Pro) - Image Analysis Access granted (Unlimited)")
    elif tier == 'paid': # Keep existing paid tier logic (assuming unlimited)
        can_analyze = True
        should_increment = False
        logger.info(f"User {user_id} (Paid) - Image Analysis Access granted (Unlimited)")
    elif tier == 'premium': # New Premium tier
        max_monthly_scans = 50 # Defined limit
        max_daily_scans = 3 # Defined limit
        # Check monthly limit
        if monthly_scans_used < max_monthly_scans:
            # Check daily limit
            if current_daily_for_check < max_daily_scans:
                can_analyze = True
                should_increment = True # Increment both monthly and daily
                logger.info(f"User {user_id} (Premium) - Image Analysis Access granted (Monthly: {monthly_scans_used}/{max_monthly_scans}, Daily: {current_daily_for_check}/{max_daily_scans})")
            else:
                logger.info(f"User {user_id} (Premium) Daily image scan limit reached ({current_daily_for_check}/{max_daily_scans})")
                return jsonify({'error': f'Daily analysis limit ({max_daily_scans}) reached for Premium plan.', 'limitReached': 'daily'}), 429 # Too Many Requests
        else:
             logger.info(f"User {user_id} (Premium) Monthly image scan limit reached ({monthly_scans_used}/{max_monthly_scans})")
             return jsonify({'error': f'Monthly analysis limit ({max_monthly_scans}) reached for Premium plan. Upgrade or wait until next cycle.', 'limitReached': 'monthly'}), 429 # Too Many Requests
    elif tier == 'commercial':
        max_scans = user_profile.get('maxAllowedScans', 0)
        if max_scans <= 0:
            logger.info(f"User {user_id} (Commercial) has max scans set to {max_scans}. Denying image analysis access.")
            return jsonify({'error': 'Commercial plan has no scans allowed. Contact admin.', 'upgradeRequired': False}), 403
        if monthly_scans_used < max_scans:
            can_analyze = True
            should_increment = True # Increment monthly count
            logger.info(f"User {user_id} (Commercial) - Image Analysis Access granted ({monthly_scans_used}/{max_scans})")
        else:
            logger.info(f"User {user_id} (Commercial) image scan limit reached ({monthly_scans_used}/{max_scans}).")
            return jsonify({'error': f'Commercial scan limit reached ({monthly_scans_used}/{max_scans} used). Contact admin for more.', 'limitReached': 'monthly'}), 429
    elif tier == 'free':
        free_limit = 3
        if monthly_scans_used < free_limit:
            can_analyze = True
            should_increment = True # Increment monthly count
            logger.info(f"User {user_id} (Free) - Image Analysis Access granted ({monthly_scans_used}/{free_limit})")
        else:
             logger.info(f"User {user_id} (Free) image scan limit reached ({monthly_scans_used}/{free_limit}).")
             return jsonify({'error': 'Free analysis limit reached. Please upgrade.', 'upgradeRequired': True, 'limitReached': 'monthly'}), 429
    else:
        # Unknown subscription tier
        logger.info(f"User {user_id} has unknown subscription tier for image analysis: {tier}")
        return jsonify({'error': 'Invalid subscription status.'}), 403
        
    if not can_analyze:
         # Fallback denial
         logger.info(f"User {user_id} (Tier: {tier}) - Image Analysis Access denied (Fallback check)")
         return jsonify({'error': 'Analysis not permitted with current subscription.'}), 403
    # --- End Authorization & Subscription Check ---

    if 'imageFile' not in request.files:
        return jsonify({'error': 'No image file found in the request'}), 400

    file = request.files['imageFile']

    if file.filename == '':
        return jsonify({'error': 'No selected image file'}), 400

    # Optional: Add more robust file validation (e.g., size, allowed extensions)
    # filename = secure_filename(file.filename) # Consider if needed
    # if not allowed_image_file(filename): # Assumes allowed_image_file exists
    #    return jsonify({'error': 'Invalid image file type'}), 400

    try:
        # Perform the analysis using the helper function
        analysis_result_text = analyze_image(file)

        # --- Increment scan counts if needed (Corrected Call) ---
        if should_increment:
            # Use the new function and pass the tier
            if not increment_scan_counts(user_id, tier):
                 # Log error but proceed - analysis was done, just count failed
                 logger.info(f"CRITICAL: Failed to increment scan counts for user {user_id} (tier: {tier}) after successful image analysis.")
                 # Consider adding to a retry queue or alert system
        # --- End Increment ---

        # Return the result in the same format as /api/analyze for consistency
        # Currently returning text, wrap it in the expected structure
        return jsonify({
            "success": True, 
            "extractedInfo": {
                 "image_summary": analysis_result_text # Put text result here
            } 
            # Add other fields if the prompt is adjusted for structured JSON
        })

    except ImportError as e:
         logger.info(f"ImportError in /api/analyze-image: {e}")
         return jsonify({'error': f'Server configuration error: {e}'}), 500
    except ValueError as e: # Catch specific errors from analyze_image
        logger.info(f"ValueError in /api/analyze-image: {e}")
        return jsonify({'error': f'Analysis Error: {e}'}), 400 # Bad Request or specific error
    except GoogleAPIError as e: # Catch Google API specific errors (rate limits, auth)
         logger.info(f"GoogleAPIError in /api/analyze-image: {e}")
         # Provide a more generic error to the user
         return jsonify({'error': 'Failed to communicate with the analysis service. Please try again later.'}), 503 # Service Unavailable
    except Exception as e:
        logger.info(f"Unexpected error in /api/analyze-image: {e}")
        # Log the full traceback for debugging if possible
        import traceback
        traceback.print_exc() 
        return jsonify({'error': 'An unexpected server error occurred during image analysis.'}), 500

@app.errorhandler(Exception)
def handle_unexpected_error(e):
    """Catches any unhandled exception."""
    try:
        import sentry_sdk
        event_id = sentry_sdk.capture_exception(e)
        logger.info(f"Unhandled error caught. Sentry Event ID: {event_id}")
        # Also log the traceback for local debugging
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'An unexpected server error occurred.',
            'sentry_event_id': event_id
        }), 500
    except Exception as sentry_error:
        # If Sentry itself fails, log to console and return a basic 500
        import traceback
        logger.info("--- CRITICAL: Sentry logging failed ---")
        traceback.print_exc()
        logger.info("--- ORIGINAL EXCEPTION ---")
        traceback.print_exc()
        logger.info("------------------------------------")
        return jsonify({'error': 'An unexpected server error occurred and the error logging facility failed.'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    app.run(host='0.0.0.0', port=port, debug=True) # Added debug=True for development 