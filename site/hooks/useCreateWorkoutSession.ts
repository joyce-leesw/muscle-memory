import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateSessionBody = {
  workout_type_id: number;
  date: string;
};

export const useCreateWorkoutSession = (
  date: string,
  setShowSessionModal: (val: boolean) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type_id: number) => {
      const body: CreateSessionBody = {
        workout_type_id: type_id,
        date,
      };

      const response = await fetch(`http://127.0.0.1:8000/workout_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Session created:", data);
      setShowSessionModal(false);
      queryClient.invalidateQueries({ queryKey: ["workoutTypes"] });
    },
    onError: (error) => {
      console.error("Failed to create session:", error);
      alert("Something went wrong while creating a session.");
    },
  });
};
