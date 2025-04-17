import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkoutSessionMap, NewWorkout } from "@/types/workout";

export const useCreateWorkout = (
  allWorkouts: WorkoutSessionMap,
  date: string,
  setAddWorkout: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newWorkout: NewWorkout) => {
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

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Workout created:", data);
      setAddWorkout(false);
      queryClient.invalidateQueries({ queryKey: ["workoutTypes"] });
    },
    onError: (error) => {
      console.error("Failed to create workout:", error);
      alert("Something went wrong while creating the workout.");
    },
  });
};
