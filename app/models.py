from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone
from pydantic import BaseModel

Base = declarative_base()

class Workout(Base):
	__tablename__ = 'workouts'

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, nullable=False)
	reps = Column(Integer, nullable=False)
	weight = Column(Integer, nullable=False)
	date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class WorkoutBase(BaseModel):
	name: str
	reps: int
	weight: int
	date: datetime

	class Config:
		from_attributes = True