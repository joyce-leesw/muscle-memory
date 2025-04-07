import argparse
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta, timezone

models.Base.metadata.create_all(bind=engine)

def main():
	parser = argparse.ArgumentParser(description="Add a workout to the database or get workouts for a date")
	parser.add_argument("--name", "-n", type=str, help="Workout name")
	parser.add_argument("--reps", "-r", type=int, help="Number of reps")
	parser.add_argument("--weight", "-w", type=int, help="Weight used")
	parser.add_argument("--sets", "-s", type=int, help="Number of sets")
	parser.add_argument("--date", "-d", type=str, help="Date to fetch workouts for (YYYY-MM-DD)")

	args = parser.parse_args()
	
	if args.name and args.reps and args.weight and args.sets:
		add_workout(args.name, args.reps, args.weight, args.sets)
		get_all_workouts()
	elif args.date:
		try:
			selected_date = datetime.strptime(args.date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
			get_workouts_for_date(selected_date)
		except ValueError:
			print("❌ Invalid date format. Please use YYYY-MM-DD.")
	else:
		parser.print_help()

def add_workout(name: str, reps: int, weight: int, sets=int):
	db: Session = SessionLocal()
	try:
		workout = models.Workout(name=name, reps=reps, weight=weight, sets=sets)
		db.add(workout)
		db.commit()
		db.refresh(workout)
		print(f"Added workout: {workout.name} - {workout.reps} reps @ {workout.weight}kg x {workout.sets} sets")
	finally:
		db.close()

def get_all_workouts():
	db: Session = SessionLocal()
	try:
		workouts = db.query(models.Workout).all()
		if workouts:
			print("All Workouts:")
			for workout in workouts:
				print(f"{workout.name} - {workout.reps} reps @ {workout.weight}kg x {workout.sets} sets")
		else:
			print("No workouts found.")
	finally:
		db.close()

def get_workouts_for_date(selected_date: datetime):
	db: Session = SessionLocal()
	try:
		start_of_day = datetime.combine(selected_date.date(), datetime.min.time()).replace(tzinfo=timezone.utc)
		end_of_day = start_of_day + timedelta(days=1)

		workouts = db.query(models.Workout).filter(
			models.Workout.date >= start_of_day,
			models.Workout.date < end_of_day
		).all()

		if workouts:
			print(f"Workouts on {selected_date.date()}:")
			for workout in workouts:
				print(f"{workout.name} - {workout.reps} reps @ {workout.weight}kg x {workout.sets} sets")
		else:
			print(f"No workouts found on {selected_date.date()}.")
	finally:
		db.close()

if __name__ == "__main__":
	main()