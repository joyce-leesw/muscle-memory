"use client";

import logo from "../public/fitlog.png";
import Image from "next/image";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useState } from "react";

const Fitlog: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const gradientTextStyle =
    "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-700 w-fit mx-auto";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-lg m-auto p-2">
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

            <div className="flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="bg-white p-4 rounded-xl shadow-lg"
                modifiersClassNames={{
                  selected: 'bg-sky-700 text-white',
                  today: 'text-sky-700 font-bold',
                }}
                disabled={{ after: new Date() }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitlog;