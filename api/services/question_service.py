# services/question_service.py
from typing import List, Optional
from models.question import WouldYouRatherQuestion, WouldYouRatherQuestionResponse
from data.firebase import db
from services.logging_service import LoggingService

class QuestionService:
    @staticmethod
    async def add_would_you_rather_question(question: WouldYouRatherQuestion) -> WouldYouRatherQuestionResponse:
        try:
            doc_ref = db.collection("would_you_rather").add({"option1": question.option1, "option2": question.option2, "category": question.category})
            LoggingService.log('INFO', 'Question added successfully', __name__, 'add_would_you_rather_question', 9)
            return {"id": doc_ref[1].id, "option1": question.option1, "option2": question.option2, "category": question.category}
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'add_would_you_rather_question', 12)
            raise

    @staticmethod
    async def get_would_you_rather_questions(category: Optional[str] = None) -> List[WouldYouRatherQuestionResponse]:
        try:
            if category:
                docs = db.collection("would_you_rather").where("category", "==", category).stream()
            else:
                docs = db.collection("would_you_rather").stream()
            questions = [{"id": doc.id, "option1": doc.to_dict().get("option1"), "option2": doc.to_dict().get("option2"), "category": doc.to_dict().get("category")} for doc in docs]
            LoggingService.log('INFO', 'Questions retrieved successfully', __name__, 'get_would_you_rather_questions', 22)
            return questions
        except Exception as e:
            LoggingService.log_exception(e, __name__, 'get_would_you_rather_questions', 25)
            raise
