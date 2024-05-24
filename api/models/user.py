from pydantic import BaseModel, EmailStr, Field, field_validator

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20, description="Username must be between 3 and 20 characters")
    email: EmailStr | None = Field(default=None)
    password: str = Field(..., min_length=6, max_length=20, description="Password must be between 6 and 20 characters")

    @field_validator("username")
    def normalize_username(cls, value):
        return value.lower()
    @field_validator("password")
    def password_complexity(cls, value):
        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(char.islower() for char in value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one digit")
        return value

class UserInDB(User):
    hashed_password: str