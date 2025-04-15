export type Workout = {
  id: number;
  name: string;
  reps: number;
  weight: number;
  sets: number;
}

export type WorkoutSession = {
  id: number;
  date: string;
  workouts: Workout[];
}

export type WorkoutType = {
  id: number;
  name: string;
  color: string;
  sessions: WorkoutSession[];
}

export type WorkoutSessionMap = {
  [date: string]: {
    sessionId: number;
    workouts: Workout[];
  };
};

export type NewWorkout = {
	name: string;
	reps: number;
	weight: number;
	sets: number;
}