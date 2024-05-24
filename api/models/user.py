from pydantic import BaseModel, EmailStr, Field, field_validator

class User(BaseModel):
    username: str
    email: EmailStr | None = Field(default=None)
    password: str

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value):
        if len(value) < 3:
            raise ValueError("Password should have at least 3 characters")
        if len(value) > 20:
            raise ValueError("Password should have at most 20 characters")
        return value.lower()

    @field_validator("password")
    @classmethod
    def password_complexity(cls, value):
        if len(value) < 6:
            raise ValueError("Password should have at least 6 characters")
        if len(value) > 20:
            raise ValueError("Password should have at most 20 characters")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(char.islower() for char in value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one digit")
        return value

class UserInDB(User):
    hashed_password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr | None = Field(default=None)

class Config:
    from_attributes = True