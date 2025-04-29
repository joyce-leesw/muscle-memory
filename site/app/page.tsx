"use client";

import CalendarView from "@/components/CalendarView";
import Head from "next/head";
import Image from "next/image";
import logo from "../public/muscle-memory.png";
import { useState } from "react";
import Overview from "@/components/Overview";

export default function Home() {
  const [tab, setTab] = useState(0);
  const gradientTextStyle =
    "text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-700 w-fit mx-auto";

  return (
    <div>
      <Head>
        <title>Muscle Memory - Your workout logs</title>
        <meta name="description" content="Track your workout progress" />
      </Head>
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
              <div className="flex justify-center mb-4 space-x-4">
                <button
                  className={`px-4 py-2 rounded-md ${
                    tab === 0
                      ? "bg-sky-600 text-white"
                      : "bg-white border border-sky-600"
                  }`}
                  onClick={() => setTab(0)}
                >
                  Calendar
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    tab === 1
                      ? "bg-sky-600 text-white"
                      : "bg-white border border-sky-600"
                  }`}
                  onClick={() => setTab(1)}
                >
                  Overview
                </button>
              </div>

              {tab === 0 ? <CalendarView /> : <Overview />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
