from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schema import WorkoutTypeCreate, WorkoutTypeUpdate, WorkoutTypeBase
from services import workout_type_service
from typing import List

router = APIRouter()


@router.post("/workout_type")
def create_workout_type(payload: WorkoutTypeCreate, db: Session = Depends(get_db)):
    return workout_type_service.create_workout_type(payload, db)


@router.put("/update_workout_type")
def update_workout_type(
    id: int, payload: WorkoutTypeUpdate, db: Session = Depends(get_db)
):
    return workout_type_service.update_workout_type(id, payload, db)


@router.delete("/delete_workout_type")
def delete_workout_type(id: int, db: Session = Depends(get_db)):
    return workout_type_service.delete_workout_type(id, db)


@router.get("/get_workout_types", response_model=List[WorkoutTypeBase])
def get_workout_types(db: Session = Depends(get_db)):
    return workout_type_service.get_workout_types(db)
