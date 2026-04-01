"use client";

import { useState, useEffect } from "react";

export default function ProductionControlDashboard() {
  const [operator, setOperator] = useState("");
  const [material, setMaterial] = useState("Steel");
  const [expectedOutput, setExpectedOutput] = useState(100);
  const [actualOutput, setActualOutput] = useState<number | "">("");
  const [batchStarted, setBatchStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (batchStarted) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [batchStarted]);

  const variance =
    actualOutput === ""
      ? 0
      : Number(actualOutput) - Number(expectedOutput);

  const varianceColor =
    variance < 0 ? "text-red-600" : "text-green-600";

  const startBatch = () => {
    if (!operator) {
      alert("Please enter operator name");
      return;
    }
    setBatchStarted(true);
    setSeconds(0);
  };

  const stopBatch = () => {
    setBatchStarted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Production Control Dashboard
        </h1>

        {/* Operator */}
        <div>
          <label className="block font-semibold mb-1">
            Operator Name
          </label>
          <input
            type="text"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full border p-2 rounded-lg"
            placeholder="Enter operator name"
          />
        </div>

        {/* Material */}
        <div>
          <label className="block font-semibold mb-1">
            Select Material
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option>Steel</option>
            <option>Plastic</option>
            <option>Aluminum</option>
            <option>Copper</option>
          </select>
        </div>

        {/* Expected Output */}
        <div>
          <label className="block font-semibold mb-1">
            Expected Output
          </label>
          <input
            type="number"
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Actual Output */}
        <div>
          <label className="block font-semibold mb-1">
            Actual Output
          </label>
          <input
            type="number"
            value={actualOutput}
            onChange={(e) =>
              setActualOutput(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
            className="w-full border p-2 rounded-lg"
            placeholder="Enter actual output"
          />
        </div>

        {/* Timer */}
        <div className="text-center">
          <p className="text-lg font-semibold">
            Batch Timer: {seconds} seconds
          </p>
        </div>

        {/* Variance */}
        {actualOutput !== "" && (
          <div className="text-center">
            <p className={`text-xl font-bold ${varianceColor}`}>
              Variance: {variance}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          {!batchStarted ? (
            <button
              onClick={startBatch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Start Batch
            </button>
          ) : (
            <button
              onClick={stopBatch}
              className="bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Stop Batch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}