import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewWorkout as UpdatedWorkout } from "@/types/workout";

export const useUpdateWorkout = (
  setAddWorkout: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedWorkout,
    }: {
      id: number;
      updatedWorkout: UpdatedWorkout;
    }) => {
      const body = {
        name: updatedWorkout.name,
        reps: updatedWorkout.reps,
        weight: updatedWorkout.weight,
        sets: updatedWorkout.sets,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/update_workout?id=${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Workout updated:", data);
      setAddWorkout(false);
      queryClient.invalidateQueries({ queryKey: ["workoutTypes"] });
    },
    onError: (error) => {
      console.error("Failed to update workout:", error);
      alert("Something went wrong while updating the workout.");
    },
  });
};

