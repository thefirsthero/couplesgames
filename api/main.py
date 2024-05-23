from fastapi import FastAPI, HTTPException, Depends, status, Query
from pydantic import BaseModel
from typing import List, Optional, Dict
from firebase_admin import credentials, firestore
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
import firebase_admin
import datetime

from data.firebase import db

app = FastAPI()

# Security and Authentication Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class UserInDB(User):
    hashed_password: str

class WouldYouRatherQuestion(BaseModel):
    option1: str
    option2: str
    category: Optional[str] = None

class WouldYouRatherQuestionResponse(BaseModel):
    id: str
    option1: str
    option2: str
    category: Optional[str] = None

class Room(BaseModel):
    room_name: str
    player1: Optional[str] = None
    player2: Optional[str] = None
    is_active: bool = True
    questions: Optional[List[WouldYouRatherQuestion]] = None

class RoomResponse(BaseModel):
    room_id: str
    room_name: str
    player1: Optional[str] = None
    player2: Optional[str] = None
    is_active: bool
    questions: Optional[List[WouldYouRatherQuestion]] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def get_user(username: str):
    user_ref = db.collection('players').document(username).get()
    if user_ref.exists:
        user_dict = user_ref.to_dict()
        return UserInDB(**user_dict)
    return None

async def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=User)
async def register(user: User):
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.update({"hashed_password": hashed_password})
    user_ref = db.collection('players').document(user.username)
    if user_ref.get().exists:
        raise HTTPException(status_code=400, detail="Username already registered")
    user_ref.set(user_dict)
    return user

@app.post("/would_you_rather", response_model=WouldYouRatherQuestionResponse)
async def add_would_you_rather_question(question: WouldYouRatherQuestion):
    doc_ref = db.collection("would_you_rather").add({"option1": question.option1, "option2": question.option2, "category": question.category})
    return {"id": doc_ref[1].id, "option1": question.option1, "option2": question.option2, "category": question.category}

@app.get("/would_you_rather", response_model=List[WouldYouRatherQuestionResponse])
async def get_would_you_rather_questions(category: Optional[str] = Query(None)):
    if category:
        docs = db.collection("would_you_rather").where("category", "==", category).stream()
    else:
        docs = db.collection("would_you_rather").stream()
    questions = [{"id": doc.id, "option1": doc.to_dict().get("option1"), "option2": doc.to_dict().get("option2"), "category": doc.to_dict().get("category")} for doc in docs]
    return questions

@app.post("/rooms", response_model=RoomResponse)
async def create_room(room: Room, current_user: User = Depends(get_current_user)):
    room_dict = room.dict()
    room_dict.update({
        "player1": current_user.username,
        "is_active": True,
        "questions": []
    })
    doc_ref = db.collection('rooms').add(room_dict)
    return {"room_id": doc_ref[1].id, **room_dict}

@app.post("/rooms/{room_id}/join", response_model=RoomResponse)
async def join_room(room_id: str, current_user: User = Depends(get_current_user)):
    room_ref = db.collection('rooms').document(room_id)
    room = room_ref.get()
    if not room.exists:
        raise HTTPException(status_code=404, detail="Room not found")
    room_dict = room.to_dict()
    if room_dict.get("player2") is not None:
        raise HTTPException(status_code=400, detail="Room is full")
    if room_dict.get("player1") == current_user.username:
        raise HTTPException(status_code=400, detail="You are already in the room")
    room_dict["player2"] = current_user.username
    room_ref.update(room_dict)
    return {"room_id": room_id, **room_dict}

@app.post("/rooms/{room_id}/leave", response_model=RoomResponse)
async def leave_room(room_id: str, current_user: User = Depends(get_current_user)):
    room_ref = db.collection('rooms').document(room_id)
    room = room_ref.get()
    if not room.exists:
        raise HTTPException(status_code=404, detail="Room not found")
    room_dict = room.to_dict()
    if room_dict.get("player1") == current_user.username:
        room_dict["player1"] = room_dict.get("player2")
        room_dict["player2"] = None
    elif room_dict.get("player2") == current_user.username:
        room_dict["player2"] = None
    else:
        raise HTTPException(status_code=400, detail="You are not in the room")
    
    if not room_dict["player1"]:
        room_ref.delete()
        return {"room_id": room_id, "room_name": room_dict["room_name"], "player1": None, "player2": None, "is_active": False, "questions": None}
    
    room_ref.update(room_dict)
    return {"room_id": room_id, **room_dict}

@app.get("/rooms", response_model=List[RoomResponse])
async def get_rooms():
    rooms = db.collection('rooms').where("is_active", "==", True).stream()
    return [{"room_id": room.id, **room.to_dict()} for room in rooms]

# Adding custom "Would You Rather" questions to a room
@app.post("/rooms/{room_id}/questions", response_model=WouldYouRatherQuestionResponse)
async def add_custom_would_you_rather_question(room_id: str, question: WouldYouRatherQuestion, current_user: User = Depends(get_current_user)):
    room_ref = db.collection('rooms').document(room_id)
    room = room_ref.get()
    if not room.exists:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room_dict = room.to_dict()
    if current_user.username not in [room_dict.get("player1"), room_dict.get("player2")]:
        raise HTTPException(status_code=403, detail="You are not in this room")
    
    question_data = {"option1": question.option1, "option2": question.option2, "category": question.category}
    if "questions" not in room_dict:
        room_dict["questions"] = []
    room_dict["questions"].append(question_data)
    room_ref.update({"questions": room_dict["questions"]})

    return {"id": len(room_dict["questions"]) - 1, **question_data}

@app.get("/rooms/{room_id}/questions", response_model=List[WouldYouRatherQuestionResponse])
async def get_room_questions(room_id: str, current_user: User = Depends(get_current_user)):
    room_ref = db.collection('rooms').document(room_id)
    room = room_ref.get()
    if not room.exists:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room_dict = room.to_dict()
    if current_user.username not in [room_dict.get("player1"), room_dict.get("player2")]:
        raise HTTPException(status_code=403, detail="You are not in this room")
    
    questions = room_dict.get("questions", [])
    response_questions = [{"id": idx, "option1": q["option1"], "option2": q["option2"], "category": q["category"]} for idx, q in enumerate(questions)]
    return response_questions

# Room automatic deletion logic on leave room and room destruction when empty
@app.post("/rooms/{room_id}/leave", response_model=RoomResponse)
async def leave_room(room_id: str, current_user: User = Depends(get_current_user)):
    room_ref = db.collection('rooms').document(room_id)
    room = room_ref.get()
    if not room.exists:
        raise HTTPException(status_code=404, detail="Room not found")
    room_dict = room.to_dict()
    if room_dict.get("player1") == current_user.username:
        room_dict["player1"] = room_dict.get("player2")
        room_dict["player2"] = None
    elif room_dict.get("player2") == current_user.username:
        room_dict["player2"] = None
    else:
        raise HTTPException(status_code=400, detail="You are not in the room")
    
    if not room_dict["player1"]:
        room_ref.delete()
        return {"room_id": room_id, "room_name": room_dict["room_name"], "player1": None, "player2": None, "is_active": False, "questions": None}
    
    room_ref.update(room_dict)
    return {"room_id": room_id, **room_dict}

# Getting predefined "Would You Rather" questions by category
@app.get("/would_you_rather", response_model=List[WouldYouRatherQuestionResponse])
async def get_would_you_rather_questions(category: Optional[str] = Query(None)):
    if category:
        docs = db.collection("would_you_rather").where("category", "==", category).stream()
    else:
        docs = db.collection("would_you_rather").stream()
    questions = [{"id": doc.id, "option1": doc.to_dict().get("option1"), "option2": doc.to_dict().get("option2"), "category": doc.to_dict().get("category")} for doc in docs]
    return questions

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

