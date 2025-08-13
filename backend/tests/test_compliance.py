from ..app import create_app

def test_compliance_template():
    app = create_app()
    client = app.test_client()
    resp = client.get('/api/compliance/template')
    assert resp.status_code == 200
    assert 'template' in resp.get_json()
