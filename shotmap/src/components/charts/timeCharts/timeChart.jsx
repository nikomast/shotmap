import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TimeChart = ({ clickHistory }) => {
  const validClicks = clickHistory.filter((click) => click.timeBetweenClicks !== null);

  const totalClicks = validClicks.length;
  const totalTime = validClicks.reduce((sum, click) => sum + click.timeBetweenClicks, 0);
  const averageTime = totalClicks > 0 ? (totalTime / totalClicks).toFixed(2) : 0;
  const longestTime = totalClicks > 0 ? Math.max(...validClicks.map((click) => click.timeBetweenClicks)) : 0;
  const shortestTime = totalClicks > 0 ? Math.min(...validClicks.map((click) => click.timeBetweenClicks)) : 0;

  const data = [
    { name: "Longest Time", time: longestTime },
    { name: "Shortest Time", time: shortestTime },
    { name: "Average Time", time: parseFloat(averageTime) },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="time" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimeChart;
