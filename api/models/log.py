from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Log(BaseModel):
    timestamp: datetime
    level: str
    message: str
    module: str
    function: str
    line: int
    username: Optional[str] = None
