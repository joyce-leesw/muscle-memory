type NewWorkout = {
	name: string;
	reps: number;
	weight: number;
	sets: number;
}

type Workout = {
	id: number;
  name: string;
  reps: number;
  weight: number;
  sets: number;
}

type WorkoutSessionMap = {
  [date: string]: {
    sessionId: number;
    workouts: Workout[];
  };
};

export const useCreateWorkout = (
	allWorkouts: WorkoutSessionMap,
	date: string,
	setAddWorkout: (val: boolean) => void
) => {
	const createWorkout = async (newWorkout: NewWorkout) => {
		try {
			const body = {
				name: newWorkout.name,
				reps: newWorkout.reps,
				weight: newWorkout.weight,
				sets: newWorkout.sets,
				workout_session_id: allWorkouts[date].sessionId,
			};

			const response = await fetch(`http://127.0.0.1:8000/create_workout`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Workout created:", data);
			setAddWorkout(false);
		} catch (error) {
			console.error("Failed to create workout:", error);
			alert("Something went wrong while creating the workout.");
		}
	};

	return createWorkout;
};
