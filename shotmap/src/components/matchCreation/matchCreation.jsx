import React, { useState, useEffect } from "react";
import { createMatch, fetchTeams, fetchSeries, fetchTeamsInSeries } from "../../../utility/api";
import { NotificationManager } from "../../components/notifications/notification";
import "./matchCreation.css";

const MatchCreation = ({onMatchCreated}) => {
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [teams, setTeams] = useState([]);
  const [opponentTeams, setOpponentTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seriesData = await fetchSeries();
        const teamsData = await fetchTeams();
        setSeries(seriesData);
        setTeams(teamsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSeriesChange = async (e) => {
    const selectedSeriesId = e.target.value;
    setSelectedSeries(selectedSeriesId);
    setSelectedTeam("");
    setSelectedOpponent("");
    setOpponentTeams([]);

    if (!selectedSeriesId) return;

    try {
      const seriesTeams = await fetchTeamsInSeries(selectedSeriesId);
      setOpponentTeams(seriesTeams);
    } catch (err) {
      setError("Failed to fetch opponent teams: " + err.message);
    }
  };

  const handleTeamChange = (e) => {
    const selectedTeamId = e.target.value;
    setSelectedTeam(selectedTeamId);
    setSelectedOpponent("");

    if (selectedSeries) {
      fetchTeamsInSeries(selectedSeries)
        .then((seriesTeams) => {
          const updatedOpponents = seriesTeams.filter(
            (team) => team.id !== parseInt(selectedTeamId)
          );
          setOpponentTeams(updatedOpponents);
        })
        .catch((err) => setError("Failed to reload opponent teams: " + err.message));
    }
  };

  const handleOpponentChange = (e) => setSelectedOpponent(e.target.value);

  const handleCreateMatch = async () => {
    if (!selectedSeries || !selectedTeam || !selectedOpponent) {
      setError("Please select series, team, and opponent before creating a match.");
      return;
    }

    setError(null);

    try {
      const matchData = { series: selectedSeries, team: selectedTeam, opponent: selectedOpponent };
      const response = await createMatch(matchData);
      NotificationManager.success("Match created successfully! Match ID: "+ response.id);

      if (onMatchCreated) {
        onMatchCreated(response);
      }
    } catch (err) {
      setError("Failed to create match: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="match-creation-container">
      <label className="match-creation-label">
        Select Series:
        <select
          className="match-creation-dropdown"
          onChange={handleSeriesChange}
          value={selectedSeries}
        >
          <option value="">Select a Series</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="match-creation-label">
        Select Your Team:
        <select
          className="match-creation-dropdown"
          onChange={handleTeamChange}
          value={selectedTeam}
          disabled={!selectedSeries}
        >
          <option value="">Select a Team</option>
          {teams
            .filter((team) => team.series.includes(parseInt(selectedSeries)))
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
        </select>
      </label>

      <label className="match-creation-label">
        Select Opponent:
        <select
          className="match-creation-dropdown"
          onChange={handleOpponentChange}
          value={selectedOpponent}
          disabled={!selectedTeam}
        >
          <option value="">Select an Opponent</option>
          {opponentTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>

      <button
        className="match-creation-button"
        onClick={handleCreateMatch}
        disabled={!selectedTeam || !selectedOpponent}
      >
        Create New Match
      </button>
      {error && <p className="match-creation-error">{error}</p>}
    </div>
  );
};

export default MatchCreation;
