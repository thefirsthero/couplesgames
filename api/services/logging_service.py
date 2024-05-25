from datetime import datetime
from typing import Optional
from data.firebase import db
from models.log import Log

class LoggingService:
    @staticmethod
    def log(level: str, message: str, module: str, function: str, line: int, username: Optional[str] = None):
        log_entry = Log(
            timestamp=datetime.utcnow(),
            level=level,
            message=message,
            module=module,
            function=function,
            line=line,
            username=username
        )
        db.collection('logs').add(log_entry.dict())

    @staticmethod
    def log_exception(exc: Exception, module: str, function: str, line: int, username: Optional[str] = None):
        LoggingService.log('ERROR', str(exc), module, function, line, username)
