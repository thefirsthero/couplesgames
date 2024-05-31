from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from models.token import Token
from models.user import User, UserResponse
from services.auth_service import AuthService
from data.firebase import db

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await AuthService.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=AuthService.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    # Persist the token in the database
    db.collection('players').document(user.username).update({"token": access_token})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse)
async def register(user: User):
    return await AuthService.register_user(user)

@router.get("/login-status")
async def login_status(current_user: User = Depends(AuthService.get_current_user)):
    return {"message": "You are logged in", "user": current_user.username}

@router.delete("/delete-user")
async def delete_user(username: str, password: str, current_user: User = Depends(AuthService.get_current_user)):
    # Check if the current user is authenticated
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    # Validate username and password
    user = await AuthService.authenticate_user(username, password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    # Delete the user
    deleted_user = await AuthService.delete_user(username)
    if not deleted_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {"message": "User deleted successfully"}

