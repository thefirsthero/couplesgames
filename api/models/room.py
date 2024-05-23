from pydantic import BaseModel
from typing import Optional, List
from .question import WouldYouRatherQuestion

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
