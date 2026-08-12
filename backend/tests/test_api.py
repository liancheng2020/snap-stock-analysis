from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_analysis_lifecycle() -> None:
    created = client.post(
        '/api/analysis/single',
        json={'symbol': '700', 'market': 'HK', 'depth': 3},
    )
    assert created.status_code == 202

    task = client.get(f"/api/tasks/{created.json()['task_id']}")
    assert task.status_code == 200
    payload = task.json()
    assert payload['state'] == 'SUCCESS'
    assert payload['result']['symbol'] == '00700'
    assert len(payload['result']['agents']) == 4


def test_rejects_invalid_depth() -> None:
    response = client.post(
        '/api/analysis/single',
        json={'symbol': 'AAPL', 'market': 'US', 'depth': 8},
    )
    assert response.status_code == 422
