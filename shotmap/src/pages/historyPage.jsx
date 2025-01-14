import React, { useState, useEffect } from "react";
import { useLogin } from "../context/loginContext";
import ReactSelect from "react-select";
import ClickChart from "../components/charts/clickCharts/clickCharts";
import DataGrid from "../components/dataGrid/dataGrid";
import TimeChart from "../components/charts/timeCharts/timeChart";
import HistoryFilter from "../components/historyFilter/historyFilter";
import { fetchClickHistory } from "../../utility/api";
import "../index.css";

const HistoryPage = () => {
  const { user } = useLogin();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [clickHistory, setClickHistory] = useState([]);
  const [chartData, setChartData] = useState([
    { name: "Possessions", count: 0 },
    { name: "Shots Taken", count: 0 },
    { name: "Goals Scored", count: 0 },
  ]);
  const [isWideEnough, setIsWideEnough] = useState(true);

  const updateChartData = (history) => {
    const updatedChartData = [
      { name: "Possessions", count: history.length },
      { name: "Shots Taken", count: history.filter((h) => h.shotOccurred === "Yes").length },
      { name: "Goals Scored", count: history.filter((h) => h.goalScored === "Yes").length },
    ];
    setChartData(updatedChartData);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWideEnough(window.innerWidth >= 700);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) return; 
    const loadTeams = async () => {
      const history = await fetchClickHistory();
      const teamOptions = Object.keys(history).map((team) => ({
        value: team,
        label: team,
      }));
      setTeams(teamOptions);
    };

    loadTeams();
  }, [user]);

  useEffect(() => {
    if (!selectedTeam || user) return; 
    const loadClickHistory = async () => {
      const history = await fetchClickHistory();
      const teamHistory = history[selectedTeam.value] || [];
      setClickHistory(teamHistory);
      updateChartData(teamHistory);
    };

    loadClickHistory();
  }, [selectedTeam, user]);

  const handleMatchActionsChange = (actions) => {
    setClickHistory(actions);
    updateChartData(actions);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "blue",
      margin: "0.5em auto",
      padding: "5px",
      boxShadow: "none",
      "&:hover": { borderColor: "darkblue" },
      width: "100%",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "lightblue" : "white",
      color: "black",
    }),
  };

  const handleFocus = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="history-page">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {!isWideEnough ? (
        <div className="screen-text">
          <p>
          Screen is too small. Please rotate your device or use a larger screen.
          </p>
        </div>
      ) : (
        <>
          <h2>Team History</h2>
          {!user && (
          <ReactSelect
          options={teams}
          value={selectedTeam}
          onChange={setSelectedTeam}
          onFocus={handleFocus}
          placeholder="Select a team..."
          isClearable
          styles={customStyles}
        />
          )}
          
          {user && <HistoryFilter onMatchActionsChange={handleMatchActionsChange} />}

          {!selectedTeam && !user && (
            <div style={{ marginTop: "20px", color: "gray" }}>
              <h3>How to use:</h3>
              <p className="how-to">Select a team from the dropdown menu above to view historical data related to matches against that team.</p>
            </div>
          )}

          {(selectedTeam || user) && (
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
      )}
    </div>
  );
};

export default HistoryPage;
