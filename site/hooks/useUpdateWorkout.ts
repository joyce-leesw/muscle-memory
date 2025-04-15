import { NewWorkout as UpdatedWorkout } from "@/types/workout";

export const useUpdateWorkout = (
	setAddWorkout: (val: boolean) => void
) => {
	const updateWorkout = async (id: number, updatedWorkout: UpdatedWorkout) => {
		try {
			const body = {
				name: updatedWorkout.name,
				reps: updatedWorkout.reps,
				weight: updatedWorkout.weight,
				sets: updatedWorkout.sets,
			};

			const response = await fetch(`http://127.0.0.1:8000/update_workout?id=${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Workout updated:", data);
			setAddWorkout(false);
		} catch (error) {
			console.error("Failed to update workout:", error);
			alert("Something went wrong while updating the workout.");
		}
	};

	return updateWorkout;
};
