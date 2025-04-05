import argparse
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

def main():
	parser = argparse.ArgumentParser(description="Add a workout to the database")
	parser.add_argument("--name", "-n", type=str, required=True, help="Workout name")
	parser.add_argument("--reps", "-r", type=int, required=True, help="Number of reps")
	parser.add_argument("--weight", "-w", type=int, required=True, help="Weight used")

	args = parser.parse_args()
	add_workout(args.name, args.reps, args.weight)
	get_workouts()

def add_workout(name: str, reps: int, weight: int):
	db: Session = SessionLocal()
	try:
		workout = models.Workout(name=name, reps=reps, weight=weight)
		db.add(workout)
		db.commit()
		db.refresh(workout)
		print(f"Added workout: {workout.name} - {workout.reps} reps @ {workout.weight}kg")
	finally:
		db.close()

def get_workouts():
	db: Session = SessionLocal()
	try:
		workouts = db.query(models.Workout).limit(5).all()
		if workouts:
			print("First 5 Workouts:")
			for workout in workouts:
				print(f"{workout.name} - {workout.reps} reps @ {workout.weight}kg")
		else:
			print("No workouts found.")
	finally:
		db.close()

if __name__ == "__main__":
	main()