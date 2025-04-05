from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from typing import List
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()

@app.post("/update_workouts/")
def create_workout(name: str, reps: int, weight: int, db: Session = Depends(get_db)):
	workout = models.Workout(name=name, reps=reps, weight=weight)
	db.add(workout)
	db.commit()
	db.refresh(workout)
	return workout

@app.get("/get_workouts/", response_model=List[models.WorkoutBase])
def get_workouts(db: Session = Depends(get_db)):
	workouts = db.query(models.Workout).all()
	return workouts