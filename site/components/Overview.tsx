"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useGetWorkoutTypesData } from "@/hooks/useGetWorkoutData";
import { WorkoutSession, WorkoutType } from "@/types/workout";

const Overview: React.FC = () => {
	const [selectedType, setSelectedType] = useState<string>("");
  const [graphData, setGraphData] = useState<{ date: string; volume: number }[]>([]);
	const { data } = useGetWorkoutTypesData();
  const yearToFirstDateMap = new Map<string, string>();
  const chronologicalData = [...graphData].reverse();
  chronologicalData.forEach(({ date }) => {
    const year = new Date(date).getFullYear().toString();
    if (!yearToFirstDateMap.has(year)) {
      yearToFirstDateMap.set(year, date);
    }
  });
  const yearTicks = Array.from(yearToFirstDateMap.values());


  useEffect(() => {
    if (!selectedType) return;

    const workoutType = data?.allData.find((type: WorkoutType) => type.name === selectedType);
    if (!workoutType) return;

    const transformed = workoutType.sessions.map((session: WorkoutSession) => ({
      date: session.date,
      volume: session.volume,
    }));

    setGraphData(transformed);
  }, [selectedType, data]);

  return (
    <div>
      <div className="flex justify-center mb-6">
        <select
          className="border-sky-600 px-4 py-2 rounded-md"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select a Workout Type</option>
          {data?.allData.map((type: WorkoutType) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {chronologicalData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chronologicalData} margin={{ bottom: 20 }}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" label={{ value: "Time", position: "insideBottom", dy: 20 }} ticks={yearTicks} tickFormatter={(date) => new Date(date).getFullYear().toString()}/>
            <YAxis label={{ value: "Total Volume (kg)", angle: -90, position: "insideLeft", dy: 50 }} />
            <Tooltip />
            <Line type="monotone" dataKey="volume" stroke="#0284c7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}

export default Overview;