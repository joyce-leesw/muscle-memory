from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from typing import List
from datetime import datetime, timezone
from fastapi.middleware.cors import CORSMiddleware
from models import Base, WorkoutType, WorkoutSession, Workout
from schema import WorkoutTypeCreate, WorkoutSessionCreate, WorkoutCreate, WorkoutTypeBase, WorkoutSessionBase, WorkoutBase, WorkoutUpdate, WorkoutTypeFull

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()

@app.post("/workout_type")
def create_workout_type(payload: WorkoutTypeCreate, db: Session = Depends(get_db)):
	workout_type = WorkoutType(name=payload.name, color=payload.color)

	db.add(workout_type)
	db.commit()
	db.refresh(workout_type)
	return workout_type

@app.get("/get_workout_types", response_model=List[WorkoutTypeBase])
def get_workout_types(db: Session = Depends(get_db)):
	workouts_types = db.query(WorkoutType).all()
	return workouts_types

@app.post("/workout_session")
def create_workout_session(payload: WorkoutSessionCreate, db: Session = Depends(get_db)):
	workout_type = db.query(WorkoutType).filter(WorkoutType.id == payload.workout_type_id).first()
	if not workout_type:
		raise HTTPException(status_code=404, detail="Workout type not found")

	session_date = payload.date or datetime.now(timezone.utc)

	workout_session = WorkoutSession(
		workout_type_id=payload.workout_type_id,
		date=session_date
	)

	db.add(workout_session)
	db.commit()
	db.refresh(workout_session)
	return workout_session

@app.get("/get_workout_sessions", response_model=List[WorkoutSessionBase])
def get_workout_sessions(db: Session = Depends(get_db)):
	workouts_sessions = db.query(WorkoutSession).all()
	return workouts_sessions

@app.post("/create_workout")
def create_workout(payload: WorkoutCreate, db: Session = Depends(get_db)):
	workout_session = db.query(WorkoutSession).filter(WorkoutSession.id == payload.workout_session_id).first()
	if not workout_session:
		raise HTTPException(status_code=404, detail="Workout session not found")
	
	workout = Workout(name=payload.name, reps=payload.reps, weight=payload.weight, sets=payload.sets, workout_session_id=payload.workout_session_id)

	db.add(workout)
	db.commit()
	db.refresh(workout)
	return workout

@app.delete("/delete_workout")
def delete_workout(id: int, db: Session = Depends(get_db)):
	workout = db.query(Workout).filter(Workout.id == id).first()
	if not workout:
		raise HTTPException(status_code=404, detail="Workout not found")

	db.delete(workout)
	db.commit()
	return {"message": f"Workout with ID {id} deleted successfully"}

@app.put("/update_workout")
def update_workout(id: int, payload: WorkoutUpdate, db: Session = Depends(get_db)):
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

@app.get("/get_all_workouts", response_model=List[WorkoutBase])
def get_all_workouts(db: Session = Depends(get_db)):
	workouts = db.query(Workout).all()
	return workouts

@app.get("/get_workout_types_with_sessions_and_workouts", response_model=List[WorkoutTypeFull])
def get_workout_types_with_sessions_and_workouts(db: Session = Depends(get_db)):
	workouts_types = db.query(WorkoutType).all()

	response = []

	for workout_type in workouts_types:
		sessions = []
		for session in workout_type.sessions:
			workouts = []
			for workout in session.workouts:
				workouts.append({
					"id": workout.id,
					"name": workout.name,
					"reps": workout.reps,
					"weight": workout.weight,
					"sets": workout.sets
				})
			sessions.append({
				"id": session.id,
				"date": session.date.strftime('%Y-%m-%d'),
				"workouts": workouts,
			})
		response.append({
			"id": workout_type.id,
			"name": workout_type.name,
			"color": workout_type.color,
			"sessions": sessions
		})
	return response
