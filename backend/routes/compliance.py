from flask import Blueprint, jsonify

compliance_bp = Blueprint('compliance', __name__, url_prefix='/api/compliance')

@compliance_bp.route('/template', methods=['GET'])
def get_template():
    return jsonify({'template': None}), 200
