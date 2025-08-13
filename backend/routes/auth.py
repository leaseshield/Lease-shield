from flask import Blueprint, jsonify

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'ok'}), 200
