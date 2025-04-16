"use client";

import logo from "../public/muscle-memory.png";
import Image from "next/image";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useEffect, useState } from "react";
import Logs from "./Logs";
import { useGetWorkoutTypesData } from "@/hooks/useGetWorkoutData";

const CalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data, isSuccess } = useGetWorkoutTypesData();

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
                alt="Muscle Memory logo"
              />
              <div>
                <h1 className={`${gradientTextStyle} text-3xl font-light`}>
                  Muscle Memory
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
                    modifiers={data?.colorDateMap}
                    modifiersClassNames={{
                      selected: 'bg-sky-700 text-white rounded-full',
                      today: 'text-sky-700 font-bold',
                      green: 'bg-green-500 text-white rounded-full',
                      cyan: 'bg-cyan-500 text-white rounded-full',
                      amber: 'bg-amber-500 text-white rounded-full'
                    }}
                    disabled={{ after: new Date() }}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4 bg-white rounded-xl">
                  {data?.types.map((type, idx) => (
                    <div key={idx} className="flex items-center gap-2 my-2">
                      <span
                        className={`w-3 h-3 rounded-full inline-block ${`bg-${type.color}-500`}`}
                      />
                      <span className="text-sm text-gray-700">{type.name}</span>
                    </div>
                  ))}
                </div>
                <Logs date={selectedDate.toLocaleDateString("sv-SE", {timeZone: "Europe/London"})} allWorkouts={data?.sessionMap ?? {}} workoutTypes={data?.types ?? []}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;