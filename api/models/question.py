from pydantic import BaseModel, validator
from typing import Optional

class WouldYouRatherQuestion(BaseModel):
    option1: str
    option2: str
    category: Optional[str] = None

    @validator('category')
    def validate_category(cls, value):
        if value:
            valid_categories = ['relationships', 'career', 'finance', 'health', 'fun']
            if value.lower() not in valid_categories:
                raise ValueError(f'Invalid category. Must be one of {", ".join(valid_categories)}')
        return value

class WouldYouRatherQuestionResponse(BaseModel):
    id: str
    option1: str
    option2: str
    category: Optional[str] = None
