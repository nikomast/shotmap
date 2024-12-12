import React, { useState, useEffect } from "react";
import ClickableGrid from "../components/clickableGrid/clickableGrid";
import ClickChart from "../components/charts/clickCharts/clickCharts";
import DataGrid from "../components/dataGrid/dataGrid";
import TimeChart from "../components/charts/timeCharts/timeChart";
import "../index.css";

const MainPage = () => {
  const [clickHistory, setClickHistory] = useState([]);
  const [chartData, setChartData] = useState([
    { name: "Total Clicks", count: 0 },
    { name: "Shots Taken", count: 0 },
    { name: "Goals Scored", count: 0 },
  ]);
  const [isWideEnough, setIsWideEnough] = useState(true); 

  useEffect(() => {
    const handleResize = () => {
      setIsWideEnough(window.innerWidth >= 800);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCellClick = (click) => {
    setClickHistory((prev) => [...prev, click]);
    const newChartData = [...chartData];
    newChartData[0].count += 1;
    if (click.shotOccurred === "Yes") {
      newChartData[1].count += 1;
      if (click.goalScored === "Yes") {
        newChartData[2].count += 1;
      }
    }
    setChartData(newChartData);
  };

  return (
    <div>
      {isWideEnough ? (
      <>
      <div style={{ marginTop: "20px", color: "gray", margin: "auto", width: "50%"  }}>
        <h3>How to Use:</h3>
        <p>When your team gains possession of the ball, mark it on the grid below. (Session-based data is not saved anywhere.)</p>
        <ul>
          <li>When possession is lost, click the grid again to mark it.</li>
          <li>You will then be asked whether it was due to a shot, and if the shot resulted in a goal.</li>
        </ul>
      </div>
      <ClickableGrid rows={16} cols={32} onCellClick={handleCellClick} />
      <div style={{ marginTop: "30px", color: "gray", margin: "auto", width: "50%"}}>
        <p>Below, you can see the data you’ve inputted during this session.</p>
      </div>

      <ClickChart data={chartData} />
      <TimeChart clickHistory={clickHistory} />
      <DataGrid
        rows={16}
        cols={32}
        clickHistory={clickHistory}
        colors={{
          firstClick: "yellow",
          secondClickNoGoal: "red",
          secondClickGoal: "green",
        }}
      />
      </>
       ) : (
        <div style={{ color: "red", marginTop: "50%", width: "50%", margin: "auto" }}>
          <p>
            The grid component is not available on smaller screens. Please rotate your device to landscape mode or use a larger screen.
          </p>
        </div>
      )}
    </div>
  );
};

export default MainPage;
