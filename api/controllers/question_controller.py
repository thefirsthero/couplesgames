from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from models.question import WouldYouRatherQuestion, WouldYouRatherQuestionResponse
from services.question_service import QuestionService

router = APIRouter()

@router.post("/would_you_rather", response_model=WouldYouRatherQuestionResponse)
async def add_would_you_rather_question(question: WouldYouRatherQuestion):
    return await QuestionService.add_would_you_rather_question(question)

@router.get("/would_you_rather", response_model=List[WouldYouRatherQuestionResponse])
async def get_would_you_rather_questions(category: Optional[str] = Query(None)):
    return await QuestionService.get_would_you_rather_questions(category)
