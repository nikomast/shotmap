import React, { useState, useEffect } from "react";
import "./clock.css";

const Clock = ({ onTimeUpdate }) => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [time, isRunning, onTimeUpdate]);

  const startClock = () => setIsRunning(true);
  const stopClock = () => setIsRunning(false);
  const resetClock = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="clock">
      <h3>{formatTime(time)}</h3>
        <button className="clock-button" onClick={startClock} disabled={isRunning}>
            ▶ Start
        </button>
        <button className="clock-button" onClick={stopClock} disabled={!isRunning}>
            ⏸ Pause
        </button>
        <button className="clock-button" onClick={resetClock}>
            🔄 Reset
        </button>
        </div>
  );
};

export default Clock;
