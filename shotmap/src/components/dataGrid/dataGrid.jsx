import React from "react";
import GridMap from "../gridMap/gridMap";
import "./dataGrid.css";

const DataGrid = ({ rows, cols, clickHistory, colors, showLegend = true }) => {
  const firstClickCounts = new Map();
  const secondClickNoGoalCounts = new Map();
  const secondClickGoalCounts = new Map();

  clickHistory?.forEach((click) => {
    const { firstClick, secondClick, shotOccurred, goalScored } = click;

    if (firstClick) {
      const key = `${firstClick.row},${firstClick.col}`;
      firstClickCounts.set(key, (firstClickCounts.get(key) || 0) + 1);
    }

    if (secondClick) {
      const key = `${secondClick.row},${secondClick.col}`;
      if (shotOccurred === "Yes" && goalScored === "Yes") {
        secondClickGoalCounts.set(key, (secondClickGoalCounts.get(key) || 0) + 1);
      } else {
        secondClickNoGoalCounts.set(key, (secondClickNoGoalCounts.get(key) || 0) + 1);
      }
    }
  });

  const cellStyles = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const key = `${row},${col}`;
      const firstClickCount = firstClickCounts.get(key) || 0;
      const secondClickNoGoalCount = secondClickNoGoalCounts.get(key) || 0;
      const secondClickGoalCount = secondClickGoalCounts.get(key) || 0;

      if (firstClickCount > 0) {
        const opacity = Math.min(1, 0.2 + firstClickCount * 0.2);
        return { backgroundColor: `rgba(255, 255, 0, ${opacity})` };
      }
      if (secondClickNoGoalCount > 0) {
        const opacity = Math.min(1, 0.2 + secondClickNoGoalCount * 0.2);
        return { backgroundColor: `rgba(255, 0, 0, ${opacity})` };
      }
      if (secondClickGoalCount > 0) {
        const opacity = Math.min(1, 0.2 + secondClickGoalCount * 0.2);
        return { backgroundColor: `rgba(0, 255, 0, ${opacity})` };
      }

      return {};
    })
  );

  return (
    <div className="dataGrid-container">
      {showLegend && (
        <>
          <h2>Past Plays</h2>
          <p>Darker color = more overlaps</p>
          <div className="legend">
            <ul>
              <li>
                <span
                  className="legend-color"
                  style={{ backgroundColor: "rgba(255, 255, 0, 1)" }}
                ></span>
                Start of possession
              </li>
              <li>
                <span
                  className="legend-color"
                  style={{ backgroundColor: "rgba(255, 0, 0, 1)" }}
                ></span>
                Loss of possession
              </li>
              <li>
                <span
                  className="legend-color"
                  style={{ backgroundColor: "rgba(0, 255, 0, 1)" }}
                ></span>
                Goal
              </li>
            </ul>
          </div>
        </>
      )}
      <GridMap
        rows={rows}
        cols={cols}
        onCellClick={() => {}}
        cellStyles={cellStyles}
      />
    </div>
  );
};

export default DataGrid;
