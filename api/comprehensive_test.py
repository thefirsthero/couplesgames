import os
import pytest
from httpx import AsyncClient
from fastapi import status
from main import app
from services.auth_service import AuthService
from services.room_service import RoomService
from models.user import User
from models.room import Room
from models.question import WouldYouRatherQuestion
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="module")
def test_client():
    return AsyncClient(app=app, base_url="http://test")

# Define the auth_headers fixture
@pytest.fixture
async def auth_headers(test_client):
    # Authenticate a user to get the authentication headers
    response = await test_client.post("/auth/token", data={"username": "testuser", "password": "TestPass123"})
    assert response.status_code == status.HTTP_200_OK
    access_token = response.json()["access_token"]
    return {"Authorization": f"Bearer {access_token}"}

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
async def test_login_status(test_client, auth_headers):
    # Await the auth_headers fixture to get the authentication headers
    headers = await auth_headers
    response = await test_client.get("/auth/login-status", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["user"] == "testuser"


@pytest.mark.asyncio
async def test_add_would_you_rather_question(test_client, auth_headers):
    headers = await auth_headers
    response = await test_client.post("/questions/would_you_rather/add", json={
        "option1": "Option 1",
        "option2": "Option 2",
        "category": "fun"
    }, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["option1"] == "Option 1"

@pytest.mark.asyncio
async def test_get_would_you_rather_questions(test_client, auth_headers):
    headers = await auth_headers
    response = await test_client.get("/questions/would_you_rather/get", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_create_room(test_client, auth_headers):
    headers = await auth_headers
    response = await test_client.post("/rooms/create", json={
        "room_name": "TestRoom"
    }, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["room_name"] == "TestRoom"

@pytest.mark.asyncio
async def test_join_room(test_client, auth_headers):
    # Ensure room is created first
    await test_create_room(test_client, auth_headers)
    headers = await auth_headers
    response = await test_client.post("/rooms/testroom/join", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["player2"] == "testuser"

@pytest.mark.asyncio
async def test_leave_room(test_client, auth_headers):
    headers = await auth_headers
    response = await test_client.post("/rooms/testroom/leave", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["player2"] is None

@pytest.mark.asyncio
async def test_add_question_to_room(test_client, auth_headers):
    headers = await auth_headers
    response = await test_client.post("/rooms/testroom/questions", json={
        "option1": "Question 1",
        "option2": "Question 2",
        "category": "fun"
    }, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["option1"] == "Question 1"

@pytest.mark.asyncio
async def test_get_room_questions(test_client, auth_headers):
    headers = await auth_headers
    response = await test_client.get("/rooms/testroom/questions", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_handle_token_expiration():
    await AuthService.handle_token_expiration()
    # Assuming handle_token_expiration logs an appropriate message
    # Further checks can be added if there are specific expected outcomes

@pytest.mark.asyncio
async def test_delete_user_authenticated(test_client, auth_headers):
    # Register a user for testing
    await test_client.post("/auth/register", json={
        "username": "testuser_delete",
        "email": "testuser_delete@example.com",
        "password": "TestPass123"
    })

    # Delete the user with authentication
    headers = await auth_headers
    response = await test_client.delete("/auth/delete-user", params={"username": "testuser_delete", "password": "TestPass123"}, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "User deleted successfully"
