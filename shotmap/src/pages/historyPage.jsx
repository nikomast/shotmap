import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import ClickChart from "../components/charts/clickCharts/clickCharts";
import DataGrid from "../components/dataGrid/dataGrid";
import TimeChart from "../components/charts/timeCharts/timeChart"; // Import TimeChart
import { fetchClickHistory } from "../../utility/api";
import "../index.css";

const HistoryPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [clickHistory, setClickHistory] = useState([]);
  const [chartData, setChartData] = useState([
    { name: "Total Clicks", count: 0 },
    { name: "Shots Taken", count: 0 },
    { name: "Goals Scored", count: 0 },
  ]);
  const [isWideEnough, setIsWideEnough] = useState(true); 


  useEffect(() => {
    const loadTeams = async () => {
      const history = await fetchClickHistory();
      const teamOptions = Object.keys(history).map((team) => ({
        value: team,
        label: team,
      }));
      setTeams(teamOptions);
    };
    loadTeams();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsWideEnough(window.innerWidth >= 800);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedTeam) return;

    const loadClickHistory = async () => {
      const history = await fetchClickHistory();
      const teamHistory = history[selectedTeam.value] || [];
      setClickHistory(teamHistory);

      const updatedChartData = [
        { name: "Total Clicks", count: teamHistory.length },
        { name: "Shots Taken", count: teamHistory.filter((h) => h.shotOccurred === "Yes").length },
        { name: "Goals Scored", count: teamHistory.filter((h) => h.goalScored === "Yes").length },
      ];
      setChartData(updatedChartData);
    };

    loadClickHistory();
  }, [selectedTeam]);

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "blue",
      boxShadow: "none",
      "&:hover": { borderColor: "darkblue" },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "lightblue" : "white",
      color: "black",
    }),
  };

  return (
    <div>
      {isWideEnough ? (
        <>
      <h2>Team History</h2>
      <ReactSelect
        options={teams}
        value={selectedTeam}
        onChange={setSelectedTeam}
        placeholder="Select a team..."
        isClearable
        styles={customStyles}
      />

      {!selectedTeam && (
        <div style={{ marginTop: "20px", color: "gray" }}>
          <h3>How to Use:</h3>
          <p>Select a team from the dropdown menu above to view historical data related to matches against that team.</p>
          <p>Once a team is selected, you'll see:</p>
          <ul>
            <li>A chart summarizing the total clicks, shots taken, and goals scored.</li>
            <li>A bar chart with time-based statistics (Longest Time, Shortest Time, Average Time).</li>
            <li>A data grid with detailed click history for the selected team.</li>
          </ul>
        </div>
      )}

      {selectedTeam && (
        <>
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
      )}
      </>
       ) : (
        <div style={{ color: "red", marginBottom: "50%", width: "50%", margin: "auto" }}>
          <p>
            The grid component is not available on smaller screens. Please rotate
            your device to landscape mode or use a larger screen.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
