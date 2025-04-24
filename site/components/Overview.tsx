"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { useGetWorkoutTypesData } from "@/hooks/useGetWorkoutData";
import { WorkoutSession, WorkoutType } from "@/types/workout";

const Overview: React.FC = () => {
	const [selectedType, setSelectedType] = useState<string>("");
  const [graphData, setGraphData] = useState<{ date: string; volume: number }[]>([]);
  const [average, setAverage] = useState(0);
  const [target, setTarget] = useState(0);
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
    setAverage(workoutType.average);
    setTarget(50);
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
        <>
          <div className="flex flex-wrap justify-end gap-2 my-3 mx-3">
            <div className="flex items-center gap-2 my-1 mx-2">
              <span
                className="w-3 h-3 rounded-full inline-block bg-red-500"
              />
              <span className="text-sm text-gray-700">Average</span>
            </div>
            <div className="flex items-center gap-2 my-1 mx-2">
              <span
                className="w-3 h-3 rounded-full inline-block bg-green-700"
              />
              <span className="text-sm text-gray-700">Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chronologicalData} margin={{ bottom: 20 }}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" label={{ value: "Time", position: "insideBottom", dy: 20 }} ticks={yearTicks} tickFormatter={(date) => new Date(date).getFullYear().toString()}/>
              <YAxis label={{ value: "Total Volume (kg)", angle: -90, position: "insideLeft", dy: 50 }} />
              <Tooltip />
              <Line type="monotone" dataKey="volume" stroke="#0284c7" strokeWidth={2} />
              <ReferenceLine
                y={average}
                stroke="red"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={target}
                stroke="green"
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : null}
    </div>
  );
}

export default Overview;