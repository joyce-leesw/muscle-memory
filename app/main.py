from fastapi import FastAPI
from database import engine
from fastapi.middleware.cors import CORSMiddleware
from models import Base

from routers import workout_router, workout_session_router, workout_type_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workout_router.router)
app.include_router(workout_session_router.router)
app.include_router(workout_type_router.router)
