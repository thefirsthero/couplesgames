import datetime
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from models.token import TokenData
from models.user import User, UserInDB
from data.firebase import db
from dotenv import load_dotenv
import os

load_dotenv()

class AuthService:
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

    @classmethod
    def verify_password(cls, plain_password, hashed_password):
        return cls.pwd_context.verify(plain_password, hashed_password)

    @classmethod
    def get_password_hash(cls, password):
        return cls.pwd_context.hash(password)

    @classmethod
    def create_access_token(cls, data: dict, expires_delta: Optional[datetime.timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.datetime.utcnow() + expires_delta
        else:
            expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
        return encoded_jwt

    @classmethod
    def get_user(cls, username: str):
        user_ref = db.collection('players').document(username.lower()).get()
        if user_ref.exists:
            user_dict = user_ref.to_dict()
            return UserInDB(**user_dict)
        return None

    @classmethod
    async def authenticate_user(cls, username: str, password: str):
        user = cls.get_user(username)
        if not user:
            return False
        if not cls.verify_password(password, user.hashed_password):
            return False
        return user

    @classmethod
    async def get_current_user(cls, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except JWTError:
            raise credentials_exception
        user = cls.get_user(username=token_data.username)
        if user is None:
            raise credentials_exception
        return user

    @classmethod
    async def register_user(cls, user: User):
        user.username = user.username.lower()
        hashed_password = cls.get_password_hash(user.password)
        user_dict = user.model_dump(exclude={"password"})
        user_dict.update({"hashed_password": hashed_password})
        user_ref = db.collection('players').document(user.username)
        if user_ref.get().exists:
            raise HTTPException(status_code=400, detail="Username already registered")
        user_ref.set(user_dict)
        return user
