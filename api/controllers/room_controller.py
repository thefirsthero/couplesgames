from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.room import Room, RoomResponse
from models.question import WouldYouRatherQuestion, WouldYouRatherQuestionResponse
from models.user import User
from services.auth_service import AuthService
from services.room_service import RoomService

router = APIRouter()

@router.post("/create", response_model=RoomResponse)
async def create_room(room: Room, current_user: User = Depends(AuthService.get_current_user)):
    return await RoomService.create_room(room, current_user)

@router.post("/{room_id}/join", response_model=RoomResponse)
async def join_room(room_id: str, current_user: User = Depends(AuthService.get_current_user)):
    return await RoomService.join_room(room_id, current_user)

@router.post("/{room_id}/leave", response_model=RoomResponse)
async def leave_room(room_id: str, current_user: User = Depends(AuthService.get_current_user)):
    return await RoomService.leave_room(room_id, current_user)

@router.post("/{room_id}/questions", response_model=WouldYouRatherQuestionResponse)
async def add_question_to_room(room_id: str, question: WouldYouRatherQuestion, current_user: User = Depends(AuthService.get_current_user)):
    return await RoomService.add_question_to_room(room_id, question, current_user)

@router.get("/{room_id}/questions", response_model=List[WouldYouRatherQuestionResponse])
async def get_room_questions(room_id: str, current_user: User = Depends(AuthService.get_current_user)):
    return await RoomService.get_room_questions(room_id, current_user)
