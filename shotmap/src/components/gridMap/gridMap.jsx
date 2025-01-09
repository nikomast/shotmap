import React from "react";
import PropTypes from "prop-types";
import "./gridMap.css";

const GridMap = ({ rows, cols, onCellClick, cellStyles }) => {
  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="grid-cell"
              style={cellStyles?.[rowIndex]?.[colIndex] || {}}
              onClick={() => onCellClick(rowIndex, colIndex)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

GridMap.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  onCellClick: PropTypes.func.isRequired,
  cellStyles: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

export default GridMap;
