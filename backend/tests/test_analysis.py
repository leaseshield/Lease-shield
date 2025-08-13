from io import BytesIO
from ..app import create_app


def _client():
    app = create_app()
    return app.test_client()


def test_analyze_image_invalid_extension():
    client = _client()
    data = {'imageFile': (BytesIO(b'test'), 'test.txt')}
    headers = {'Authorization': 'Bearer valid-token'}
    resp = client.post('/api/analyze-image', data=data, headers=headers, content_type='multipart/form-data')
    assert resp.status_code == 400
    assert resp.get_json()['error'] == 'Unsupported file extension'


def test_analyze_image_file_too_large():
    client = _client()
    big_content = BytesIO(b'a' * (6 * 1024 * 1024))
    data = {'imageFile': (big_content, 'test.jpg')}
    headers = {'Authorization': 'Bearer valid-token'}
    resp = client.post('/api/analyze-image', data=data, headers=headers, content_type='multipart/form-data')
    assert resp.status_code == 400
    assert resp.get_json()['error'] == 'File too large'
