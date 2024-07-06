import re
from pydantic import BaseModel, field_validator
from typing import Dict, Optional, List
from .question import WouldYouRatherQuestion

class Room(BaseModel):
    room_name: str
    player1: Optional[str] = None
    player2: Optional[str] = None
    is_active: bool = True
    questions: Optional[List[WouldYouRatherQuestion]] = None
    turn: Optional[str] = None
    votes: Dict[str, Dict[str, str]] = {}  # Dictionary to track votes for each question


    @field_validator("room_name")
    @classmethod
    def validate_room_name(cls, value: str) -> str:
        if not re.match(r"^[^\s]+$", value):
            raise ValueError("Room name cannot contain spaces")
        if not re.match(r"^[^\d]+$", value):
            raise ValueError("Room name cannot contain numbers")
        if not re.match(r"^[^\W]+$", value):
            raise ValueError("Room name cannot contain special characters")
        return value

class RoomResponse(BaseModel):
    room_id: str
    room_name: str
    player1: Optional[str] = None
    player2: Optional[str] = None
    is_active: bool
    questions: Optional[List[WouldYouRatherQuestion]] = None
