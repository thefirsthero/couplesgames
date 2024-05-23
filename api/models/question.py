from pydantic import BaseModel
from typing import Optional, List

class WouldYouRatherQuestion(BaseModel):
    option1: str
    option2: str
    category: Optional[str] = None

class WouldYouRatherQuestionResponse(BaseModel):
    id: str
    option1: str
    option2: str
    category: Optional[str] = None
