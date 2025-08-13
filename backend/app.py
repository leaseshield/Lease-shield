import os
from flask import Flask
from flask_cors import CORS
from backend.extensions import limiter
from backend.routes.auth import auth_bp
from backend.routes.analysis import analysis_bp
from backend.routes.payments import payments_bp
from backend.routes.compliance import compliance_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    limiter.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(compliance_bp)

    return app


app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
