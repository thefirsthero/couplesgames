from typing import List
from fastapi import HTTPException
from models.room import Room, RoomResponse
from models.question import WouldYouRatherQuestion, WouldYouRatherQuestionResponse
from models.user import User
from data.firebase import db

class RoomService:
    @staticmethod
    async def create_room(room: Room, current_user: User) -> RoomResponse:
        room_dict = room.dict()
        room_dict.update({
            "player1": current_user.username,
            "is_active": True,
            "questions": []
        })
        doc_ref = db.collection('rooms').add(room_dict)
        return {"room_id": doc_ref[1].id, **room_dict}

    @staticmethod
    async def join_room(room_id: str, current_user: User) -> RoomResponse:
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

    @staticmethod
    async def leave_room(room_id: str, current_user: User) -> RoomResponse:
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

    @staticmethod
    async def add_question_to_room(room_id: str, question: WouldYouRatherQuestion, current_user: User) -> WouldYouRatherQuestionResponse:
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

    @staticmethod
    async def get_room_questions(room_id: str, current_user: User) -> List[WouldYouRatherQuestionResponse]:
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
