from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WorkoutTypeCreate(BaseModel):
	name: str
	color: Optional[str] = None

class WorkoutSessionCreate(BaseModel):
	workout_type_id: int
	date: Optional[datetime] = None

class WorkoutCreate(BaseModel):
	workout_session_id: int
	name: str
	reps: int
	weight: int
	sets: int

class WorkoutBase(BaseModel):
	id: int
	name: str
	reps: int
	weight: int
	sets: int

	class Config:
		from_attributes = True

class WorkoutUpdate(BaseModel):
	name: Optional[str] = None
	reps: Optional[int] = None
	weight: Optional[int] = None
	sets: Optional[int] = None

	class Config:
		from_attributes = True