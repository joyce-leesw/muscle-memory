from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class WorkoutType(Base):
	__tablename__ = 'workout_types'

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, nullable=False)
	color = Column(String, nullable=False)

	sessions = relationship("WorkoutSession", back_populates="workout_type")

class WorkoutSession(Base):
	__tablename__ = 'workout_sessions'

	id = Column(Integer, primary_key=True, index=True)
	date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

	workout_type_id = Column(Integer, ForeignKey('workout_types.id'))
	workout_type = relationship("WorkoutType", back_populates="sessions")

	workouts = relationship("Workout", back_populates="workout_session")

class Workout(Base):
	__tablename__ = 'workouts'

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, nullable=False)
	reps = Column(Integer, nullable=False)
	weight = Column(Integer, nullable=False)
	sets = Column(Integer, nullable=False)

	workout_session_id = Column(Integer, ForeignKey('workout_sessions.id'))
	workout_session = relationship("WorkoutSession", back_populates="workouts")