def test_list_boards_empty(client):
    response = client.get("/api/boards")
    assert response.status_code == 200
    assert response.json() == []


def test_create_board(client):
    response = client.post("/api/boards", json={"title": "My Board"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My Board"
    assert "id" in data
    assert "created_at" in data
    assert "columns" in data
    assert data["columns"] == []


def test_create_board_missing_title(client):
    response = client.post("/api/boards", json={})
    assert response.status_code == 422


def test_get_board(client):
    create_resp = client.post("/api/boards", json={"title": "Test Board"})
    board_id = create_resp.json()["id"]

    response = client.get(f"/api/boards/{board_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == board_id
    assert data["title"] == "Test Board"
    assert "columns" in data


def test_get_board_not_found(client):
    response = client.get("/api/boards/9999")
    assert response.status_code == 404


def test_delete_board(client):
    create_resp = client.post("/api/boards", json={"title": "To Delete"})
    board_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/boards/{board_id}")
    assert delete_resp.status_code == 204

    get_resp = client.get(f"/api/boards/{board_id}")
    assert get_resp.status_code == 404


def test_delete_board_not_found(client):
    response = client.delete("/api/boards/9999")
    assert response.status_code == 404
