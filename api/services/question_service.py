from typing import List, Optional
from models.question import WouldYouRatherQuestion, WouldYouRatherQuestionResponse
from data.firebase import db

class QuestionService:
    @staticmethod
    async def add_would_you_rather_question(question: WouldYouRatherQuestion) -> WouldYouRatherQuestionResponse:
        doc_ref = db.collection("would_you_rather").add({"option1": question.option1, "option2": question.option2, "category": question.category})
        return {"id": doc_ref[1].id, "option1": question.option1, "option2": question.option2, "category": question.category}

    @staticmethod
    async def get_would_you_rather_questions(category: Optional[str] = None) -> List[WouldYouRatherQuestionResponse]:
        if category:
            docs = db.collection("would_you_rather").where("category", "==", category).stream()
        else:
            docs = db.collection("would_you_rather").stream()
        questions = [{"id": doc.id, "option1": doc.to_dict().get("option1"), "option2": doc.to_dict().get("option2"), "category": doc.to_dict().get("category")} for doc in docs]
        return questions
