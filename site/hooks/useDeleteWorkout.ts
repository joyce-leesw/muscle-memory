import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteWorkout = (setAddWorkout: (val: boolean) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `http://127.0.0.1:8000/delete_workout?id=${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Deleted workout:", data);
      setAddWorkout(false);
      queryClient.invalidateQueries({ queryKey: ["workoutTypes"] });
    },
    onError: (error) => {
      console.error("Failed to delete workout:", error);
      alert("Something went wrong while deleting the workout.");
    },
  });
};
