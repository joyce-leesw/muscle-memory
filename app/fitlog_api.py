from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from typing import List, Optional
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

@app.post("/create_workout")
def create_workout(name: str, reps: int, weight: int, sets: int, date: str, db: Session = Depends(get_db)):
	workout = models.Workout(name=name, reps=reps, weight=weight, sets=sets, date=datetime.strptime(date, "%Y-%m-%d").replace(tzinfo=timezone.utc))
	db.add(workout)
	db.commit()
	db.refresh(workout)
	return workout

@app.delete("/delete_workout")
def delete_workout(id: int, db: Session = Depends(get_db)):
	workout = db.query(models.Workout).filter(models.Workout.id == id).first()
	if not workout:
		raise HTTPException(status_code=404, detail="Workout not found")

	db.delete(workout)
	db.commit()
	return {"message": f"Workout with ID {id} deleted successfully"}

@app.put("/edit_workout")
def edit_workout(id: int, name: Optional[str] = None, reps: Optional[int] = None, weight: Optional[int] = None, sets: Optional[int] = None, db: Session = Depends(get_db)):
	workout = db.query(models.Workout).filter(models.Workout.id == id).first()
	if not workout:
		raise HTTPException(status_code=404, detail="Workout not found")
	
	if name is not None:
			workout.name = name
	if reps is not None:
		workout.reps = reps
	if weight is not None:
		workout.weight = weight
	if sets is not None:
		workout.sets = sets

	db.commit()
	db.refresh(workout)
	return {"message": f"Workout with ID {id} updated successfully"}

@app.get("/get_all_workouts", response_model=List[models.WorkoutBase])
def get_all_workouts(db: Session = Depends(get_db)):
	workouts = db.query(models.Workout).all()
	return [{"id": workout.id, "name": workout.name, "reps": workout.reps, "weight": workout.weight, "sets": workout.sets, "date": workout.date} for workout in workouts]

@app.get("/get_workouts_for_date", response_model=List[models.WorkoutBase])
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

	workouts = [{"id": workout.id, "name": workout.name, "reps": workout.reps, "weight": workout.weight, "sets": workout.sets} for workout in workouts]
	print(workouts)
	return workouts