import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import { fetchTeamMatches, fetchMatchActions, fetchTeams } from "../../../utility/api";

const HistoryFilter = ({ onMatchActionsChange }) => {
  const [teams, setTeams] = useState([]);
  const [teamMatches, setTeamMatches] = useState(null);
  const [matchActions, setMatchActions] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetchTeams();
        const teamOptions = response.map((team) => ({
          value: team.id,
          label: team.name,
        }));
        setTeams(teamOptions);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    loadTeams();
  }, []); 

  useEffect(() => {
    if (!selectedTeam) return;

    const loadTeamMatches = async () => {
      try {
        const response = await fetchTeamMatches(selectedTeam.value);
        const matchOptions = response.map((match) => ({
          value: match.id,
          label: `${match.match_date} / ${match.opponent_name}`,
        }));
        //console.log("Fetched Team Matches:", matchOptions);
        setTeamMatches(matchOptions);
      } catch (error) {
        console.error("Error fetching team matches:", error);
      }
    };

    loadTeamMatches();
  }, [selectedTeam]);

  useEffect(() => {
    if (!selectedMatch) return;
    const loadMatchActions = async () => {
      try {
        const response = await fetchMatchActions(selectedMatch.value);
        const transformedData = response.map((action) => ({
          id: action.id,
          firstClick: { row: action.first_click_row, col: action.first_click_col },
          secondClick: { row: action.second_click_row, col: action.second_click_col },
          goalScored: action.goal_scored ? "Yes" : "No",
          shotOccurred: action.shot_occurred ? "Yes" : "No",
          timeBetweenClicks: action.time_between_clicks,
        }));
        onMatchActionsChange(transformedData);
        //console.log("Transformed Match Actions:", transformedData);
      } catch (error) {
        //console.error("Error fetching match actions:", error);
      }
    };
  
    loadMatchActions();
  }, [selectedMatch]);
  

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "blue",
      margin: "1em",
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
    <>
      <ReactSelect
        options={teams}
        value={selectedTeam}
        onChange={setSelectedTeam}
        placeholder="Select a team..."
        isClearable
        styles={customStyles}
      />
      {selectedTeam && (
        <ReactSelect
          options={teamMatches}
          value={selectedMatch}
          onChange={setSelectedMatch}
          placeholder="Select a match..."
          isClearable
          styles={customStyles}
        />
      )}
    </>
  );
};

export default HistoryFilter;
