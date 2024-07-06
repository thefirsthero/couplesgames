from typing import List
from fastapi import HTTPException
from models.room import Room, RoomResponse
from models.question import WouldYouRatherQuestion, WouldYouRatherQuestionResponse
from models.user import User
from data.firebase import db
from services.logging_service import LoggingService

class RoomService:
    @staticmethod
    async def create_room(room: Room, current_user: User) -> RoomResponse:
        try:
            room_dict = room.dict()
            room_dict.update({
                "player1": current_user.username,
                "turn": current_user.username,
                "is_active": True,
                "questions": [],
                "votes": {}
            })
            doc_ref = db.collection('rooms').add(room_dict)
            LoggingService.log('INFO', 'Room created successfully', __name__, 'create_room', 13, current_user.username)
            return {"room_id": doc_ref[1].id, **room_dict}
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'create_room', 16, current_user.username)
            raise


    @staticmethod
    async def join_room(room_id: str, current_user: User) -> RoomResponse:
        try:
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
            LoggingService.log('INFO', 'Joined room successfully', __name__, 'join_room', 28, current_user.username)
            return {"room_id": room_id, **room_dict}
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'join_room', 31, current_user.username)
            raise

    @staticmethod
    async def leave_room(room_id: str, current_user: User) -> RoomResponse:
        try:
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
                LoggingService.log('INFO', 'Room deleted as it became empty', __name__, 'leave_room', 48, current_user.username)
                return {"room_id": room_id, "room_name": room_dict["room_name"], "player1": None, "player2": None, "is_active": False, "questions": None}
            
            room_ref.update(room_dict)
            LoggingService.log('INFO', 'Left room successfully', __name__, 'leave_room', 54, current_user.username)
            return {"room_id": room_id, **room_dict}
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'leave_room', 57, current_user.username)
            raise

    @staticmethod
    async def add_question_to_room(room_id: str, question: WouldYouRatherQuestion, current_user: User) -> WouldYouRatherQuestionResponse:
        try:
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
            LoggingService.log('INFO', 'Question added to room', __name__, 'add_question_to_room', 72, current_user.username)

            return {"id": len(room_dict["questions"]) - 1, **question_data}
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'add_question_to_room', 75, current_user.username)
            raise

    @staticmethod
    async def get_room_questions(room_id: str, current_user: User) -> List[WouldYouRatherQuestionResponse]:
        try:
            room_ref = db.collection('rooms').document(room_id)
            room = room_ref.get()
            if not room.exists:
                raise HTTPException(status_code=404, detail="Room not found")
            
            room_dict = room.to_dict()
            if current_user.username not in [room_dict.get("player1"), room_dict.get("player2")]:
                raise HTTPException(status_code=403, detail="You are not in this room")
            
            questions = room_dict.get("questions", [])
            response_questions = [{"id": idx, "option1": q["option1"], "option2": q["option2"], "category": q["category"]} for idx, q in enumerate(questions)]
            LoggingService.log('INFO', 'Room questions retrieved', __name__, 'get_room_questions', 92, current_user.username)
            return response_questions
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'get_room_questions', 95, current_user.username)
            raise

    @staticmethod
    async def remove_user_from_rooms(username: str):
        try:
            rooms_ref = db.collection('rooms').where("player1", "==", username).stream()
            async for room in rooms_ref:
                await RoomService.leave_room(room.id, User(username=username))

            rooms_ref = db.collection('rooms').where("player2", "==", username).stream()
            async for room in rooms_ref:
                await RoomService.leave_room(room.id, User(username=username))
            LoggingService.log('INFO', 'User removed from all rooms', __name__, 'remove_user_from_rooms', 104, username)
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'remove_user_from_rooms', 106, username)
            raise

