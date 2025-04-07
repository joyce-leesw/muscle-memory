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
    new Date(2025, 3, 7),
  ];
  // const completedDays = []

  // const workoutDates = workouts.map(workout => {
  //   const dateSimplified = workout.date.split('T')[0];
  //   const [year, month, day] = dateSimplified.split('-').map(Number);
  //   return new Date(year, month-1, day);
  // });

  // completedDays.push(...workoutDates);

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
                    className="absolute top-4 right-4 text-white bg-sky-600 hover:bg-sky-700 w-8 h-8 flex items-center justify-center rounded-full shadow"
                  >
                    +
                  </button>

                  <div className="mt-10 space-y-2">
                    {workouts.length > 0 ? (
                      workouts.map((log, index) => (
                        <div key={index} className="px-2 text-left">
                          <div className="flex justify-between items-center">
                            <div>
                              <div>
                                {log.name}
                              </div>
                              <div className="flex space-x-4">
                                <span>{log.weight}kg</span>
                                <span>{log.reps} reps</span>
                                <span>{log.sets} sets</span>
                              </div>
                            </div>
                            <button
                              // onClick={() => handleEdit(index)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              edit &gt;
                            </button>
                          </div>
                          <div className="border-b border-gray-300 my-3"></div>
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