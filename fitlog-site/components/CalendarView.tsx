"use client";

import logo from "../public/fitlog.png";
import Image from "next/image";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useEffect, useState } from "react";
import Logs from "./Logs";

type Workout = {
  id?: number;
  name: string;
  reps: number;
  weight: number;
  sets: number;
  date?: string;
}

const CalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allWorkouts, setAllWorkouts] = useState<Record<string, Workout[]>>({});
  const completedDays: Date[] = [];

  Object.keys(allWorkouts).forEach((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    completedDays.push(new Date(year, month - 1, day));
  })

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/get_all_workouts`)
      .then((res) => res.json())
      .then((data: Workout[]) => {
        const grouped: Record<string, Workout[]> = {};
  
        data.forEach((workout) => {
          if (workout.date) {
            const dateKey = workout.date.split('T')[0];
            if (!grouped[dateKey]) {
              grouped[dateKey] = [];
            }
            grouped[dateKey].push(workout);
          }
        });
  
        setAllWorkouts(grouped);
        console.log(allWorkouts);
      });
  }, [allWorkouts]);

  const onRetrieve = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  }

  const gradientTextStyle =
    "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-700 w-fit mx-auto";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-md m-auto p-2">
        <div className="bg-gray-100 p-6 rounded-md">
          <div className="my-6">
            <div className="flex items-center justify-center my-5">
              <Image
                src={logo}
                width={60}
                className="rotate-90"
                alt="Fitlog logo"
              />
              <div>
                <h1 className={`${gradientTextStyle} text-3xl font-light`}>
                  Fitlog
                </h1>
                <div className={`${gradientTextStyle} text-lg`}>
                  Your workout logs
                </div>
              </div>
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

                <Logs date={selectedDate.toLocaleDateString("sv-SE", {timeZone: "Europe/London"})} allWorkouts={allWorkouts}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;