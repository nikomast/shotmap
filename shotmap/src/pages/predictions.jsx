import DataGrid from "../components/dataGrid/dataGrid";
import { fetchClickHistory } from "../../utility/api";
import React, { useState, useEffect } from "react";

const Predictions = () => {
  const [teamAHistory, setTeamAHistory] = useState([]);
  const [teamBHistory, setTeamBHistory] = useState([]);

  useEffect(() => {
    const loadClickHistory = async () => {
      const history = await fetchClickHistory();

      if (history && history["Team A"] && history["Team B"]) {
        setTeamAHistory(history["Team A"]);
        setTeamBHistory(history["Team B"]);
      }
    };

    loadClickHistory();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Predictions</h1>
      <div>
        <DataGrid
          rows={16}
          cols={32}
          clickHistory={teamAHistory} 
          colors={{
            firstClick: "yellow",
            secondClickNoGoal: "red",
            secondClickGoal: "green",
          }}
          showLegend={false}
        />
      </div>

      <div>
        <DataGrid
          rows={16}
          cols={32}
          clickHistory={teamBHistory} 
          colors={{
            firstClick: "yellow",
            secondClickNoGoal: "red",
            secondClickGoal: "green",
          }}
          showLegend={false}
        />
      </div>
    </div>
  );
};

export default Predictions;
