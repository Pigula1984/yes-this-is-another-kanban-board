def _create_board(client, title="Test Board"):
    resp = client.post("/api/boards", json={"title": title})
    assert resp.status_code == 201
    return resp.json()


def test_list_columns_empty(client):
    board = _create_board(client)
    response = client.get(f"/api/columns/{board['id']}")
    assert response.status_code == 200
    assert response.json() == []


def test_create_column(client):
    board = _create_board(client)
    response = client.post(
        "/api/columns",
        json={"title": "To Do", "position": 0, "board_id": board["id"]},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "To Do"
    assert data["position"] == 0
    assert data["board_id"] == board["id"]
    assert "id" in data
    assert "cards" in data


def test_create_column_missing_fields(client):
    response = client.post("/api/columns", json={"title": "Missing"})
    assert response.status_code == 422


def test_get_columns_for_board(client):
    board = _create_board(client)
    client.post(
        "/api/columns",
        json={"title": "To Do", "position": 0, "board_id": board["id"]},
    )
    client.post(
        "/api/columns",
        json={"title": "In Progress", "position": 1, "board_id": board["id"]},
    )

    response = client.get(f"/api/columns/{board['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    titles = {col["title"] for col in data}
    assert titles == {"To Do", "In Progress"}


def test_update_column_title(client):
    board = _create_board(client)
    col_resp = client.post(
        "/api/columns",
        json={"title": "Old Title", "position": 0, "board_id": board["id"]},
    )
    col_id = col_resp.json()["id"]

    response = client.patch(f"/api/columns/{col_id}", json={"title": "New Title"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"


def test_update_column_position(client):
    board = _create_board(client)
    col_resp = client.post(
        "/api/columns",
        json={"title": "Col", "position": 0, "board_id": board["id"]},
    )
    col_id = col_resp.json()["id"]

    response = client.patch(f"/api/columns/{col_id}", json={"position": 5})
    assert response.status_code == 200
    assert response.json()["position"] == 5


def test_delete_column(client):
    board = _create_board(client)
    col_resp = client.post(
        "/api/columns",
        json={"title": "To Delete", "position": 0, "board_id": board["id"]},
    )
    col_id = col_resp.json()["id"]

    delete_resp = client.delete(f"/api/columns/{col_id}")
    assert delete_resp.status_code == 204

    list_resp = client.get(f"/api/columns/{board['id']}")
    assert list_resp.json() == []


def test_delete_column_not_found(client):
    response = client.delete("/api/columns/9999")
    assert response.status_code == 404
