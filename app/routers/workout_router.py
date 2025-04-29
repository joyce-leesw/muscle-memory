from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schema import WorkoutCreate, WorkoutUpdate, WorkoutBase, WorkoutTypeFull
from services import workout_service
from typing import List

router = APIRouter()

@router.post("/create_workout")
def create_workout(payload: WorkoutCreate, db: Session = Depends(get_db)):
	return workout_service.create_workout(payload, db)

@router.delete("/delete_workout")
def delete_workout(id: int, db: Session = Depends(get_db)):
	return workout_service.delete_workout(id, db)

@router.put("/update_workout")
def update_workout(id: int, payload: WorkoutUpdate, db: Session = Depends(get_db)):
	return workout_service.update_workout(id, payload, db)

@router.get("/get_all_workouts", response_model=List[WorkoutBase])
def get_all_workouts(db: Session = Depends(get_db)):
	return workout_service.get_all_workouts(db)

@router.get("/get_workout_types_with_sessions_and_workouts", response_model=List[WorkoutTypeFull])
def get_workout_types_with_sessions_and_workouts(db: Session = Depends(get_db)):
	return workout_service.get_workout_types_with_sessions_and_workouts(db)

