from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class UserInDB(User):
    hashed_password: str
