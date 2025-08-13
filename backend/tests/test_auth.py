from ..app import create_app

def test_ping():
    app = create_app()
    client = app.test_client()
    resp = client.get('/api/ping')
    assert resp.status_code == 200
    assert resp.get_json()['status'] == 'ok'
