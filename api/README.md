# Couples Games API

Welcome to the Couples Games API! This API provides functionality for managing rooms and playing various games with your partner or friends.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/thefirsthero/couplesgames
cd couples-games-api
```

### 2. Set Up Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# For Windows
.venv\Scripts\Activate.ps1
```

### 3. Install Requirements

```bash
pip install -r 'requirements.txt'
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_CLIENT_CERT_URL=...
FIREBASE_TYPE=...
FIREBASE_AUTH_URI=...
FIREBASE_UNIVERSE_DOMAIN=...
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=...
FIREBASE_TOKEN_URI=...
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Firebase Configuration

Make sure you have a Firebase project set up. Update the `.env` file you created with your Firebase service account credentials.

### 6. Run the Application

```bash
python main.py
```

The API will be running at `http://localhost:8000`.

## Endpoints

### Authentication

- `/auth/token`: Generate access token by providing username and password.
- `/auth/register`: Register a new user.

### Rooms

- `/rooms`: Get active rooms.
- `/rooms/{room_id}`: Get details of a specific room.
- `/rooms/{room_id}/join`: Join a room.
- `/rooms/{room_id}/leave`: Leave a room.

### Questions

- `/questions/would_you_rather`: Get Would You Rather questions.
- `/questions/would_you_rather`: Add a new Would You Rather question.

## Swagger Documentation

You can view the Swagger documentation for the API by visiting `http://localhost:8000/docs` in your browser. This interactive documentation provides details about each endpoint, including request parameters and response schemas.

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests to help improve this project.

