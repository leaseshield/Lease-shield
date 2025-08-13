import os
from werkzeug.utils import secure_filename

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'heic', 'heif'}
MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_image_file(filename: str) -> bool:
    """Check if the file has an allowed image extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

def validate_image_file(file):
    """Validate uploaded image file for extension and size.

    Returns a tuple (filename, error_message). If validation passes, error_message is None.
    """
    if not file or file.filename == '':
        return None, 'No file provided'

    filename = secure_filename(file.filename)
    if not allowed_image_file(filename):
        return None, 'Unsupported file extension'

    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_IMAGE_FILE_SIZE:
        return None, 'File too large'

    return filename, None

def verify_token(token: str):
    """Mock token verification. Replace with real logic."""
    if token == 'valid-token':
        return 'test-user'
    return None

def is_admin(user_id: str) -> bool:
    return user_id == 'admin-user'
