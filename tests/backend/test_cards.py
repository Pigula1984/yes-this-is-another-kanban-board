def _create_board(client, title="Test Board"):
    resp = client.post("/api/boards", json={"title": title})
    assert resp.status_code == 201
    return resp.json()


def _create_column(client, board_id, title="Test Column", position=0):
    resp = client.post(
        "/api/columns",
        json={"title": title, "position": position, "board_id": board_id},
    )
    assert resp.status_code == 201
    return resp.json()


def test_list_cards_empty(client):
    board = _create_board(client)
    col = _create_column(client, board["id"])
    response = client.get(f"/api/cards/{col['id']}")
    assert response.status_code == 200
    assert response.json() == []


def test_create_card(client):
    board = _create_board(client)
    col = _create_column(client, board["id"])

    response = client.post(
        "/api/cards",
        json={"title": "Task 1", "position": 0, "column_id": col["id"]},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Task 1"
    assert data["position"] == 0
    assert data["column_id"] == col["id"]
    assert data["description"] is None
    assert "id" in data
    assert "created_at" in data


def test_create_card_with_description(client):
    board = _create_board(client)
    col = _create_column(client, board["id"])

    response = client.post(
        "/api/cards",
        json={
            "title": "Task With Desc",
            "description": "Some details here",
            "position": 0,
            "column_id": col["id"],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == "Some details here"


def test_create_card_missing_fields(client):
    response = client.post("/api/cards", json={"title": "Missing column_id"})
    assert response.status_code == 422


def test_get_cards_for_column(client):
    board = _create_board(client)
    col = _create_column(client, board["id"])

    for i in range(3):
        client.post(
            "/api/cards",
            json={"title": f"Card {i}", "position": i, "column_id": col["id"]},
        )

    response = client.get(f"/api/cards/{col['id']}")
    assert response.status_code == 200
    assert len(response.json()) == 3


def test_update_card_title(client):
    board = _create_board(client)
    col = _create_column(client, board["id"])
    card_resp = client.post(
        "/api/cards",
        json={"title": "Old Title", "position": 0, "column_id": col["id"]},
    )
    card_id = card_resp.json()["id"]

    response = client.patch(f"/api/cards/{card_id}", json={"title": "New Title"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"


def test_update_card_column(client):
    board = _create_board(client)
    col1 = _create_column(client, board["id"], title="Col 1", position=0)
    col2 = _create_column(client, board["id"], title="Col 2", position=1)

    card_resp = client.post(
        "/api/cards",
        json={"title": "Move Me", "position": 0, "column_id": col1["id"]},
    )
    card_id = card_resp.json()["id"]

    response = client.patch(f"/api/cards/{card_id}", json={"column_id": col2["id"]})
    assert response.status_code == 200
    assert response.json()["column_id"] == col2["id"]

    # Verify card is now in col2
    col2_cards = client.get(f"/api/cards/{col2['id']}").json()
    assert any(c["id"] == card_id for c in col2_cards)

    # Verify card is no longer in col1
    col1_cards = client.get(f"/api/cards/{col1['id']}").json()
    assert not any(c["id"] == card_id for c in col1_cards)


def test_update_card_position(client):
    board = _create_board(client)
    col = _create_column(client, board["id"])
    card_resp = client.post(
        "/api/cards",
        json={"title": "Card", "position": 0, "column_id": col["id"]},
    )
    card_id = card_resp.json()["id"]

    response = client.patch(f"/api/cards/{card_id}", json={"position": 3})
    assert response.status_code == 200
    assert response.json()["position"] == 3


def test_delete_card(client):
    board = _create_board(client)
    col = _create_column(client, board["id"])
    card_resp = client.post(
        "/api/cards",
        json={"title": "To Delete", "position": 0, "column_id": col["id"]},
    )
    card_id = card_resp.json()["id"]

    delete_resp = client.delete(f"/api/cards/{card_id}")
    assert delete_resp.status_code == 204

    list_resp = client.get(f"/api/cards/{col['id']}")
    assert list_resp.json() == []


def test_delete_card_not_found(client):
    response = client.delete("/api/cards/9999")
    assert response.status_code == 404
