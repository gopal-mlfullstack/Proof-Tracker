"use client"; // This makes it, a client component (needed for hooks like useEffect)

import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  const [startTime, setStartTime] = useState<number | null>(null); // Here i am storing timestamp

  useEffect(() => {
    const storedTime = localStorage.getItem("startTime");
    if (storedTime) {
      setStartTime(parseInt(storedTime, 10));
    }
  }, []); // loading on mount

  const handleStart = () => {
    const now = Date.now();
    setStartTime(now);
    localStorage.setItem("startTime", now.toString());
  };

  const handleReset = () => {
    setStartTime(null);
    localStorage.removeItem("startTime");
    // I will add Milestones later
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-counter mb-6">Proof Tracker</h1>

        {/* Counter Section */}
        <div className="text-center mb-8">
          {startTime ? (
            <div className="text-2xl font-mono">
              {/* Todo: Display counter live here */}0 days 00 hours 00 minutes
              00 seconds
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Start Tracking{" "}
            </button>
          )}
        </div>

        {/* Milestones section */}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Milestones</h2>
          <ul className="space-y-2">
            {/* TODO: Populating with messages */}
            <li className="text-gray-600">No milestones yet.</li>
          </ul>
        </div>

        {/* Reset Section */}
        {startTime && (
          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Reset (New Attempt)
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Neutral reset: Data clears, start fresh.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
