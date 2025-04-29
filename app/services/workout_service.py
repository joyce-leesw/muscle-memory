from sqlalchemy.orm import Session
from models import WorkoutSession, WorkoutType, Workout
from fastapi import HTTPException

def create_workout(payload, db: Session):
	workout_session = db.query(WorkoutSession).filter(WorkoutSession.id == payload.workout_session_id).first()
	if not workout_session:
		raise HTTPException(status_code=404, detail="Workout session not found")
	
	workout = Workout(name=payload.name, reps=payload.reps, weight=payload.weight, sets=payload.sets, workout_session_id=payload.workout_session_id)

	db.add(workout)
	db.commit()
	db.refresh(workout)
	return workout

def delete_workout(id, db: Session):
	workout = db.query(Workout).filter(Workout.id == id).first()
	if not workout:
		raise HTTPException(status_code=404, detail="Workout not found")

	db.delete(workout)
	db.commit()
	return {"message": f"Workout with ID {id} deleted successfully"}

def update_workout(id, payload, db: Session):
	workout = db.query(Workout).filter(Workout.id == id).first()
	if not workout:
		raise HTTPException(status_code=404, detail="Workout not found")
	
	if payload.name is not None:
		workout.name = payload.name
	if payload.reps is not None:
		workout.reps = payload.reps
	if payload.weight is not None:
		workout.weight = payload.weight
	if payload.sets is not None:
		workout.sets = payload.sets

	db.commit()
	db.refresh(workout)
	return {"message": f"Workout with ID {id} updated successfully"}

def get_all_workouts(db: Session):
	workouts = db.query(Workout).all()
	return workouts

def get_workout_types_with_sessions_and_workouts(db: Session):
	return db.query(WorkoutType).all()