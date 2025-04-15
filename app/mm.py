import argparse
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta, timezone
from typing import Optional

models.Base.metadata.create_all(bind=engine)

def main():
	parser = argparse.ArgumentParser(description="Add a workout to the database or get workouts for a date")
	parser.add_argument("--all", "-a", action="store_true", help="All Workouts")
	parser.add_argument("--name", "-n", type=str, help="Workout name")
	parser.add_argument("--reps", "-r", type=int, help="Number of reps")
	parser.add_argument("--weight", "-w", type=int, help="Weight used")
	parser.add_argument("--sets", "-s", type=int, help="Number of sets")
	parser.add_argument("--date", "-d", type=str, help="Date of workout (YYYY-MM-DD)")
	parser.add_argument("--id", "-id", type=str, help="ID of workout")

	args = parser.parse_args()
	
	if args.all:
		get_all_workouts()
	elif args.name and args.reps and args.weight and args.sets and args.date:
		add_workout(args.name, args.reps, args.weight, args.sets, args.date)
	elif args.id and (args.name or args.reps or args.weight or args.sets):
		update_workout(
			workout_id=args.id,
			name=args.name,
			reps=args.reps,
			weight=args.weight,
			sets=args.sets
		)
	elif args.id:
		delete_workout(args.id)
	elif args.date:
		try:
			selected_date = datetime.strptime(args.date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
			get_workouts_for_date(selected_date)
		except ValueError:
			print("❌ Invalid date format. Please use YYYY-MM-DD.")
	else:
		parser.print_help()

def add_workout(name: str, reps: int, weight: int, sets=int, date=str):
	db: Session = SessionLocal()
	try:
		workout = models.Workout(name=name, reps=reps, weight=weight, sets=sets, date=datetime.strptime(date, "%Y-%m-%d").replace(tzinfo=timezone.utc))
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
				print(f"{workout.id}: {workout.name} - {workout.reps} reps @ {workout.weight}kg x {workout.sets} sets on {workout.date.strftime("%Y-%m-%d")}")
		else:
			print("No workouts found.")
	finally:
		db.close()

def delete_workout(workout_id: int):
	db: Session = SessionLocal()
	try:
		workout = db.query(models.Workout).filter(models.Workout.id == workout_id).first()
		if workout is None:
			print("Workout not found")

		db.delete(workout)
		db.commit()
		print(f"Workout with ID ${workout_id} deleted successfully")
	finally:
		db.close()

def update_workout(workout_id: int, name: Optional[str] = None, reps: Optional[int] = None, weight: Optional[int] = None, sets: Optional[int] = None):
	db: Session = SessionLocal()
	try:
		workout = db.query(models.Workout).filter(models.Workout.id == workout_id).first()
		if workout is None:
			print("Workout not found")

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
		print(f"Workout with ID ${workout_id} updated successfully")
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