from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from controllers.auth_controller import router as auth_router
from controllers.room_controller import router as room_router
from controllers.question_controller import router as question_router

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

# @app.get("/")
# async def root():
#     return {"message": "Welcome to the Would You Rather API"}

@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
