from pydantic import BaseModel, EmailStr, SecretStr, Field
from typing import Optional

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr | None = Field(default=None)
    password: SecretStr = Field(..., min_length=3, max_length=20)

class UserInDB(User):
    hashed_password: str