from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional
from typing import List

class WorkoutTypeCreate(BaseModel):
	name: str
	color: Optional[str] = None

class WorkoutTypeBase(BaseModel):
	name: str
	color: str

	class Config:
		from_attributes = True

class WorkoutSessionCreate(BaseModel):
	workout_type_id: int
	date: Optional[datetime] = None

class WorkoutSessionBase(BaseModel):
	date: datetime

	@validator('date')
	def format_date(cls, v):
		if isinstance(v, datetime):
			return v.strftime('%Y-%m-%d')
		return v
	
	class Config:
		from_attributes = True

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

class WorkoutSessionWithWorkouts(BaseModel):
	id: int
	date: str
	workouts: List[WorkoutBase]

	@validator('date', pre=True)
	def format_date(cls, v):
		if isinstance(v, datetime):
			return v.strftime('%Y-%m-%d')
		return v

	class Config:
		from_attributes = True

class WorkoutTypeFull(BaseModel):
	id: int
	name: str
	color: str
	sessions: List[WorkoutSessionWithWorkouts]

	class Config:
		from_attributes = True