from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from typing import List
from datetime import datetime, timedelta, timezone
from fastapi.middleware.cors import CORSMiddleware
import models

models.Base.metadata.create_all(bind=engine)

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

@app.post("/create_workout/")
def create_workout(name: str, reps: int, weight: int, sets: int, db: Session = Depends(get_db)):
	workout = models.Workout(name=name, reps=reps, weight=weight, sets=sets)
	db.add(workout)
	db.commit()
	db.refresh(workout)
	return workout

@app.get("/get_all_workouts/", response_model=List[models.WorkoutBase])
def get_all_workouts(db: Session = Depends(get_db)):
	workouts = db.query(models.Workout).all()
	return workouts

@app.get("/get_workouts_for_date/", response_model=List[models.WorkoutBase])
def get_workouts_for_date(date: str, db: Session = Depends(get_db)):
	try:
		# Parse input date string (e.g., "2025-04-06")
		selected_date = datetime.strptime(date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
	except ValueError:
		raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

	start_of_day = selected_date.replace(hour=0, minute=0, second=0, microsecond=0)
	end_of_day = start_of_day + timedelta(days=1)

	workouts = db.query(models.Workout).filter(
		models.Workout.date >= start_of_day,
		models.Workout.date < end_of_day
	).all()

	# Convert SQLAlchemy models to Pydantic models and then to dicts for JSON serialization
	workout_dicts = [models.WorkoutBase.from_orm(workout).dict(exclude={"date"}) for workout in workouts]

	print(workout_dicts)
	return workout_dicts