import base64
import os
from firebase_admin import credentials, firestore, initialize_app

# Decode the Base64 encoded private key
encoded_key = os.getenv("FIREBASE_PRIVATE_KEY_BASE64")
decoded_key = base64.b64decode(encoded_key).decode('utf-8')

# Read Firebase credentials from environment variables
firebase_credentials = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": decoded_key,
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL")
}

print('private_key:', firebase_credentials.get('private_key'))
# Initialize Firebase Admin SDK
cred = credentials.Certificate(firebase_credentials)
initialize_app(cred)
db = firestore.client()
