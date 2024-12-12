import React from "react";
import GridMap from "../gridMap/gridMap";
import "./dataGrid.css";

const DataGrid = ({ rows, cols, clickHistory, colors }) => {
  const cellStyles = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({}))
  );

  clickHistory?.forEach((click) => {
    const { firstClick, secondClick, shotOccurred, goalScored } = click;

    if (firstClick) {
      cellStyles[firstClick.row][firstClick.col] = {
        backgroundColor: colors.firstClick,
      };
    }

    if (secondClick) {
      if (shotOccurred === "Yes" && goalScored === "Yes") {
        cellStyles[secondClick.row][secondClick.col] = {
          backgroundColor: colors.secondClickGoal,
        };
      } else {
        cellStyles[secondClick.row][secondClick.col] = {
          backgroundColor: colors.secondClickNoGoal,
        };
      }
    }
  });

  return (
    <div className="dataGrid-container">
      <h2>Past plays</h2>
      <div className="legend">
        <ul>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: colors.firstClick }}
            ></span>
            Start of posession
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: colors.secondClickNoGoal }}
            ></span>
            Loss of posession
          </li>
          <li>
            <span
              className="legend-color"
              style={{ backgroundColor: colors.secondClickGoal }}
            ></span>
            Goal
          </li>
        </ul>
      </div>
      <GridMap rows={rows} cols={cols} onCellClick={() => {}} cellStyles={cellStyles} />
    </div>
  );
};

export default DataGrid;
