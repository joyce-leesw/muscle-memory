from sqlalchemy.orm import Session
from models import WorkoutType
from fastapi import HTTPException

def create_workout_type(payload, db: Session):
	workout_type = WorkoutType(name=payload.name, color=payload.color)

	db.add(workout_type)
	db.commit()
	db.refresh(workout_type)
	return workout_type

def update_workout_type(id, payload, db: Session):
	workout_type = db.query(WorkoutType).filter(WorkoutType.id == id).first()
	if not workout_type:
		raise HTTPException(status_code=404, detail="Workout type not found")
	
	if payload.name is not None:
		workout_type.name = payload.name
	if payload.color is not None:
		workout_type.color = payload.color
	if payload.target is not None:
		workout_type.target = payload.target

	db.commit()
	db.refresh(workout_type)
	return {"message": f"Workout type with ID {id} updated successfully"}

def delete_workout_type(id, db: Session):
	workout_type = db.query(WorkoutType).filter(WorkoutType.id == id).first()
	if not workout_type:
		raise HTTPException(status_code=404, detail="Workout type not found")

	db.delete(workout_type)
	db.commit()
	return {"message": f"Workout type with ID {id} deleted successfully"}

def get_workout_types(db: Session):
	workouts_types = db.query(WorkoutType).all()
	return workouts_types