from sqlalchemy.orm import Session
from datetime import datetime, timezone
from models import WorkoutSession, WorkoutType, Workout
from fastapi import HTTPException


def create_workout_session(db: Session, payload):
    workout_type = (
        db.query(WorkoutType).filter(WorkoutType.id == payload.workout_type_id).first()
    )
    if not workout_type:
        raise HTTPException(status_code=404, detail="Workout type not found")

    session_date = payload.date or datetime.now(timezone.utc)

    workout_session = WorkoutSession(
        workout_type_id=payload.workout_type_id, date=session_date
    )
    db.add(workout_session)
    db.flush()

    _copy_last_workout_exercises(db, workout_session)

    db.commit()
    db.refresh(workout_session)
    return workout_session


def delete_workout_session(id, db: Session):
    workout_session = db.query(WorkoutSession).filter(WorkoutSession.id == id).first()
    if not workout_session:
        raise HTTPException(status_code=404, detail="Workout session not found")

    db.delete(workout_session)
    db.commit()
    return {"message": f"Workout session with ID {id} deleted successfully"}


def get_workout_sessions(db: Session):
    workouts_sessions = db.query(WorkoutSession).all()
    return workouts_sessions


def _copy_last_workout_exercises(db: Session, new_session: WorkoutSession):
    last_session = (
        db.query(WorkoutSession)
        .filter(
            WorkoutSession.workout_type_id == new_session.workout_type_id,
            WorkoutSession.id != new_session.id,
        )
        .order_by(WorkoutSession.date.desc())
        .first()
    )

    if not last_session:
        return

    previous_exercises = (
        db.query(Workout).filter(Workout.workout_session_id == last_session.id).all()
    )

    for prev_exercise in previous_exercises:
        new_exercise = Workout(
            name=prev_exercise.name,
            reps=prev_exercise.reps,
            weight=prev_exercise.weight,
            sets=prev_exercise.sets,
            workout_session_id=new_session.id,
        )
        db.add(new_exercise)
