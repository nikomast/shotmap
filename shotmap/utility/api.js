import axios from 'axios';

export const fetchClickHistory = async () => {
  try {
    const response = await fetch("db.json");
    if (!response.ok) {
      throw new Error("Failed to fetch click history");
    }
    const data = await response.json();
    return await data.clickHistory;
  } catch (error) {
    console.error("Error fetching click history:", error);
    return [];
  }
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const registerUser = (data) => API.post('accounts/register/', data);

export const loginUser = async (data) => {
  try {
    const response = await API.post('token/', data);
    const { access, refresh } = response.data;

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);

    return { access, refresh };
  } catch (error) {
    console.error("Failed to log in:", error);
    throw error;
  }
};


export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await API.post("token/refresh/", { refresh });
    const newAccessToken = response.data.access;

    localStorage.setItem("access", newAccessToken); 
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error; 
  }
};

export const createMatch = async (matchData) => {
  const token = localStorage.getItem("access");
  const response = await API.post("matches/", matchData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
  });

  return response.data;
};

export const fetchSeries = async () => {
  try {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");

    const response = await API.get("series/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch series: " + error.message);
  }
};

export const fetchTeams = async () => {
  try {
    const token = localStorage.getItem('access'); 
    if (!token) throw new Error("No access token found");

    const response = await API.get('teams/', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch teams: " + error.message);
  }
};


export const saveMatchAction = async (actionData) => {
  const formattedActionData = {
    match: actionData.match,
    grid_rows: actionData.grid_rows,
    grid_cols: actionData.grid_cols,
    first_click_row: actionData.firstClick.row,
    first_click_col: actionData.firstClick.col,
    second_click_row: actionData.secondClick.row,
    second_click_col: actionData.secondClick.col,
    goal_scored: actionData.goalScored === "Yes",
    shot_occurred: actionData.shotOccurred === "Yes",
    time_between_clicks: actionData.timeBetweenClicks,
    first_click_time: actionData.firstClickTime, 
    second_click_time: actionData.secondClickTime, 
  };

  try {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No access token found");

    const response = await API.post("actions/", formattedActionData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving match action:", error);
    throw error;
  }
};


export const endMatch = async (matchId, result) => {
  const token = localStorage.getItem("access");
  const response = await API.post(`matches/${matchId}/end/`, { result }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchMatchActions = async (matchId) => {
  try{
    const token = localStorage.getItem('access');
    if (!token) throw new Error("No access token found");

    const response = await API.get(`match/${matchId}/actions/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data;}
    catch (error) {
      throw new Error("Failed to fetch teams in series: " + error.message);
    }
};

export const fetchTeamMatches = async (teamId) => {
  try{
  const token = localStorage.getItem('access');
  if (!token) throw new Error("No access token found");

  const response = await API.get(`team/${teamId}/matches/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;} 
  catch (error) {
      throw new Error("Failed to fetch teams in series: " + error.message);
    }
};

export const fetchTeamsInSeries = async (seriesId) => {
  try {
    const token = localStorage.getItem('access');
    if (!token) throw new Error("No access token found");

    const response = await API.get(`series/${seriesId}/teams/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch teams in series: " + error.message);
  }
};

