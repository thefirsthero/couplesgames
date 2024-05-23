from pydantic import BaseModel, EmailStr, Field

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr | None = Field(default=None)
    password: str = Field(..., min_length=3, max_length=20)

class UserInDB(User):
    hashed_password: str