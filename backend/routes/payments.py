from flask import Blueprint, jsonify

payments_bp = Blueprint('payments', __name__, url_prefix='/api')

@payments_bp.route('/payid/create-checkout-session', methods=['POST'])
def create_checkout_session():
    return jsonify({'status': 'created'}), 200
