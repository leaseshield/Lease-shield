from flask import Blueprint, request, jsonify
from backend.utils.helpers import validate_image_file, verify_token
from backend.extensions import limiter

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api')

@analysis_bp.route('/analyze-image', methods=['POST'])
@limiter.limit("5 per minute")
def analyze_image():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    token = auth_header.split(' ', 1)[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if 'imageFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['imageFile']
    filename, error = validate_image_file(file)
    if error:
        return jsonify({'error': error}), 400

    # Placeholder for analysis logic
    return jsonify({'result': 'Image analysis not implemented', 'filename': filename}), 200
