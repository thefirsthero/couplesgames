import os
import pytest
from httpx import AsyncClient
from fastapi import status
from main import app
from services.auth_service import AuthService
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="module")
def test_client():
    return AsyncClient(app=app, base_url="http://test")

@pytest.fixture(scope="module")
async def auth_headers(test_client):
    await test_client.post("/auth/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "TestPass123"
    })
    response = await test_client.post("/auth/token", data={"username": "testuser", "password": "TestPass123"})
    assert response.status_code == status.HTTP_200_OK
    access_token = response.json()["access_token"]
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture(scope="module")
async def other_auth_headers(test_client):
    await test_client.post("/auth/register", json={
        "username": "otheruser",
        "email": "otheruser@example.com",
        "password": "OtherPass123"
    })
    response = await test_client.post("/auth/token", data={"username": "otheruser", "password": "OtherPass123"})
    assert response.status_code == status.HTTP_200_OK
    access_token = response.json()["access_token"]
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture(scope="module")
async def setup_users_and_room(test_client, auth_headers, other_auth_headers):
    other_headers = await other_auth_headers
    response = await test_client.post("/rooms/create", json={"room_name": "TestRoom"}, headers=other_headers)
    assert response.status_code == status.HTTP_200_OK
    room_id = response.json()["room_id"]
    return await auth_headers, other_headers, room_id

@pytest.mark.asyncio
async def test_register_user(test_client):
    response = await test_client.post("/auth/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "TestPass123"
    })
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["username"] == "testuser"

@pytest.mark.asyncio
async def test_login_for_access_token(test_client):
    response = await test_client.post("/auth/token", data={
        "username": "testuser",
        "password": "TestPass123"
    })
    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_status(test_client, setup_users_and_room):
    auth_headers, _, _ = setup_users_and_room
    response = await test_client.get("/auth/login-status", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["user"] == "testuser"

@pytest.mark.asyncio
async def test_add_would_you_rather_question(test_client, setup_users_and_room):
    auth_headers, _, _ = setup_users_and_room
    response = await test_client.post("/questions/would_you_rather/add", json={
        "option1": "Option 1",
        "option2": "Option 2",
        "category": "fun"
    }, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["option1"] == "Option 1"

@pytest.mark.asyncio
async def test_get_would_you_rather_questions(test_client, setup_users_and_room):
    auth_headers, _, _ = setup_users_and_room
    response = await test_client.get("/questions/would_you_rather/get", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_create_room(test_client, setup_users_and_room):
    _, other_auth_headers, _ = setup_users_and_room
    response = await test_client.post("/rooms/create", json={
        "room_name": "TestRoom"
    }, headers=other_auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["room_name"] == "TestRoom"

@pytest.mark.asyncio
async def test_join_room(test_client, setup_users_and_room):
    auth_headers, _, room_id = setup_users_and_room
    response = await test_client.post(f"/rooms/{room_id}/join", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["player2"] == "testuser"

@pytest.mark.asyncio
async def test_leave_room(test_client, setup_users_and_room):
    auth_headers, _, room_id = setup_users_and_room
    response = await test_client.post(f"/rooms/{room_id}/leave", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["player2"] is None

@pytest.mark.asyncio
async def test_add_question_to_room(test_client, setup_users_and_room):
    auth_headers, _, room_id = setup_users_and_room
    response = await test_client.post(f"/rooms/{room_id}/questions", json={
        "option1": "Question 1",
        "option2": "Question 2",
        "category": "fun"
    }, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["option1"] == "Question 1"

@pytest.mark.asyncio
async def test_get_room_questions(test_client, setup_users_and_room):
    auth_headers, _, room_id = setup_users_and_room
    response = await test_client.get(f"/rooms/{room_id}/questions", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_handle_token_expiration():
    await AuthService.handle_token_expiration()
    # Assuming handle_token_expiration logs an appropriate message
    # Further checks can be added if there are specific expected outcomes

@pytest.mark.asyncio
async def test_delete_user_authenticated(test_client, setup_users_and_room):
    await test_client.post("/auth/register", json={
        "username": "testuser_delete",
        "email": "testuser_delete@example.com",
        "password": "TestPass123"
    })

    auth_headers, _, _ = setup_users_and_room
    response = await test_client.delete("/auth/delete-user", params={"username": "testuser_delete", "password": "TestPass123"}, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "User deleted successfully"
