from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schema import WorkoutSessionCreate, WorkoutSessionBase
from services import workout_session_service
from typing import List

router = APIRouter()

@router.post("/workout_session")
def create_workout_session(payload: WorkoutSessionCreate, db: Session = Depends(get_db)):
  return workout_session_service.create_workout_session(db, payload)

@router.post("/delete_workout_session")
def delete_workout_session(id: int, db: Session = Depends(get_db)):
  return workout_session_service.delete_workout_session(id, db)

@router.post("/get_workout_sessions", response_model=List[WorkoutSessionBase])
def get_workout_sessions(db: Session = Depends(get_db)):
  return workout_session_service.get_workout_sessions(db)