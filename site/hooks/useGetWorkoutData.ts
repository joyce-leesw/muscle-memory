import { WorkoutType, WorkoutSessionMap } from "@/types/workout";
import { useQuery } from "@tanstack/react-query";

type WorkoutTypesData = {
  sessionMap: WorkoutSessionMap;
  colorDateMap: Record<string, Date[]>;
  types: { id: number; name: string; color: string }[];
  allData: WorkoutType[];
};

export const useGetWorkoutTypesData = () => {
  return useQuery<WorkoutTypesData>({
    queryKey: ["workoutTypes"],
    queryFn: async () => {
      const res = await fetch(
        "http://127.0.0.1:8000/get_workout_types_with_sessions_and_workouts",
      );
      const data: WorkoutType[] = await res.json();

      const sessionMap: WorkoutSessionMap = {};
      const colorDateMap: Record<string, Date[]> = {};
      const types: { id: number; name: string; color: string }[] = [];

      data.forEach((workoutType) => {
        const { id, name, color } = workoutType;
        types.push({ id, name, color });

        workoutType.sessions.forEach((session) => {
          const dateObj = new Date(session.date);

          sessionMap[session.date] = {
            sessionId: session.id,
            workouts: session.workouts,
          };

          if (!colorDateMap[color]) {
            colorDateMap[color] = [];
          }
          colorDateMap[color].push(dateObj);
        });
      });

      return {
        sessionMap,
        colorDateMap,
        types,
        allData: data,
      };
    },
  });
};
