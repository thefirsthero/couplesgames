from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import uvicorn
from controllers.auth_controller import router as auth_router
from controllers.room_controller import router as room_router
from controllers.question_controller import router as question_router
from services.auth_service import AuthService
from apscheduler.schedulers.asyncio import AsyncIOScheduler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(room_router, prefix="/rooms", tags=["rooms"])
app.include_router(question_router, prefix="/questions", tags=["questions"])

@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    return RedirectResponse(url="/docs")

async def start_scheduler():
    global scheduler
    scheduler = AsyncIOScheduler()
    scheduler.add_job(AuthService.handle_token_expiration, 'interval', minutes=1)
    scheduler.start()

async def stop_scheduler():
    global scheduler
    scheduler.shutdown()

app.add_event_handler("startup", start_scheduler)
app.add_event_handler("shutdown", stop_scheduler)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)