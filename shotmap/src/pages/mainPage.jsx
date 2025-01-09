import React, { useState, useEffect } from "react";
import { useLogin } from "../context/loginContext";
import { saveMatchAction} from "../../utility/api";
import ClickableGrid from "../components/clickableGrid/clickableGrid";
import ClickChart from "../components/charts/clickCharts/clickCharts";
import DataGrid from "../components/dataGrid/dataGrid";
import TimeChart from "../components/charts/timeCharts/timeChart"
import HowToMenu from "../components/howToMenu/howToMenu";
import MatchCreation from "../components/matchCreation/matchCreation";
import EndMatchButton from "../components/endmatch/endmatch";


import "../index.css";

const MainPage = () => {
  const { user } = useLogin();
  const [clickHistory, setClickHistory] = useState([]);
  const [match, setMatch] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [gridDimensions, setGridDimensions] = useState({ rows: 16, cols: 32 });
  const [chartData, setChartData] = useState([
    { name: "Possessions", count: 0 },
    { name: "Shots Taken", count: 0 },
    { name: "Goals Scored", count: 0 },
  ]);
  const [isWideEnough, setIsWideEnough] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsWideEnough(window.innerWidth >= 700);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCellClick = (click) => {
    const actionData = {
      ...click,
      grid_rows: gridDimensions.rows,
      grid_cols: gridDimensions.cols,
      match: matchDetails?.id,
    };
  
    if (match) {
      saveMatchAction(actionData);
    }

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

  const handleMatchCreated = (response) => {
    setMatch(true);
    setMatchDetails(response);
    //console.log("Match details:", response);
  };

  const handleMatchEnded = () => {
    setMatch(false);
    setMatchDetails(null);
    setClickHistory([]);
    setChartData([
      { name: "Possessions", count: 0 },
      { name: "Shots Taken", count: 0 },
      { name: "Goals Scored", count: 0 },
    ]);
  };


  return (
    <div>
      {isWideEnough ? (
      <>
      <HowToMenu/>
        
  {user && (
      <>
        <MatchCreation onMatchCreated={handleMatchCreated} />
        {match ? (
          <>
          <div className="record-plays-div">
            <ClickableGrid 
              rows={gridDimensions.rows} 
              cols={gridDimensions.cols} 
              onCellClick={handleCellClick} 
            />
            <EndMatchButton 
              matchId={matchDetails.id} 
              onMatchEnded={handleMatchEnded} 
            />
          </div>
          <div style={{ marginTop: "30px", color: "gray", margin: "auto", width: "40%" }}>
              <p>Below the charts, you can see the data you’ve inputted during this session.</p>
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
          <div style={{ marginTop: "40px", color: "gray", margin: "auto", width: "40%" }}>
            <h2>Please create a match to start recording actions.</h2>
          </div>
        )}
      </>
      )}
        
      {!user &&
      <>
        <ClickableGrid rows={16} cols={32} onCellClick={handleCellClick} />
        <div style={{ marginTop: "30px", color: "gray", margin: "auto", width: "50%"}}>
          <p>Below the charts, you can see the data you’ve inputted during this session.</p>
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
      }
      </>
       ) : (
        <div className="screen-text">
          <p>
            The grid component is not available on smaller screens. Please rotate your device to landscape mode or use a larger screen.
          </p>
        </div>
      )}
    </div>
  );
};

export default MainPage;
