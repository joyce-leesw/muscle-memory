"use client";

import logo from "../public/fitlog.png";
import Image from "next/image";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useState } from "react";

type Workout = {
  name: string;
  reps: number;
  weight: number;
  sets: number;
}

const Fitlog: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [results, setResults] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const completedDays = [
    new Date(2025, 3, 5),
    new Date(2025, 3, 6),
  ];

  const onRetrieve = (date: Date | undefined) => {
    if (!date) return;
    setIsPending(true);
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString("sv-SE", {
      timeZone: "Europe/London",
    });
    console.log("Submitting: " + formattedDate);
    fetch(`http://127.0.0.1:8000/get_workouts_for_date/?date=${formattedDate}`)
      .then((res) => res.json())
      .then(onReceive);
  }

  const onReceive = (data: Workout[]) => {
    console.log("workout unparsed", data);
    setWorkouts(data);
    setResults(true);
    setIsPending(false);
  };

  const gradientTextStyle =
    "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-700 w-fit mx-auto";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-md m-auto p-2">
        <div className="bg-gray-100 p-6 rounded-md">
          <div className="text-center my-6">
            <Image
              src={logo}
              width={200}
              className="mx-auto block"
              alt="Fitlog logo"
            />
            <h1 className={`${gradientTextStyle} text-3xl font-light`}>
              Fitlog
            </h1>
            <div className={`${gradientTextStyle} text-lg mb-5`}>
              Your workout logs
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-[320px]"> 
                <div className="flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={onRetrieve}
                    className="bg-white p-4 rounded-xl shadow-lg"
                    modifiers={{
                      completed: completedDays
                    }}
                    modifiersClassNames={{
                      selected: 'bg-sky-700 text-white rounded-full',
                      today: 'text-sky-700 font-bold',
                      completed: 'bg-cyan-500 text-white rounded-full',
                    }}
                    disabled={{ after: new Date() }}
                  />
                </div>

                <div className="bg-white p-4 rounded-xl shadow-lg relative my-3 w-full">
                  <button
                    // onClick={handleAddWorkout}
                    className="absolute top-2 right-2 text-white bg-sky-600 hover:bg-sky-700 w-8 h-8 flex items-center justify-center rounded-full shadow"
                  >
                    +
                  </button>

                  <div className="mt-8 space-y-2">
                    {workouts.length > 0 ? (
                      workouts.map((log, index) => (
                        <div key={index} className="p-2 bg-sky-700 rounded-md shadow-sm text-white text-left">
                          <div>
                            {log.name}
                          </div>
                          <div className="flex space-x-4">
                            <span>{log.weight}kg</span>
                            <span>{log.reps} reps</span>
                            <span>{log.sets} sets</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No logs for this day.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitlog;