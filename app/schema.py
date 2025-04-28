from pydantic import BaseModel, validator, computed_field
from datetime import datetime
from typing import Optional
from typing import List

class WorkoutTypeCreate(BaseModel):
	name: str
	color: Optional[str] = None

class WorkoutTypeBase(BaseModel):
	name: str
	color: str
	target: Optional[int] = None 

	class Config:
		from_attributes = True

class WorkoutTypeUpdate(BaseModel):
	name: Optional[str] = None
	color: Optional[str] = None
	target: Optional[int] = None 

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
	
	@computed_field
	@property
	def volume(self) -> int:
		return sum(w.sets * w.reps * w.weight for w in self.workouts)

	class Config:
		from_attributes = True

class WorkoutTypeFull(BaseModel):
	id: int
	name: str
	color: str
	target: Optional[int] = None 
	sessions: List[WorkoutSessionWithWorkouts]

	@computed_field
	@property
	def average(self) -> int:
		if not self.sessions:
			return 0
		total_volume = sum(session.volume for session in self.sessions)
		return total_volume // len(self.sessions)

	class Config:
		from_attributes = True