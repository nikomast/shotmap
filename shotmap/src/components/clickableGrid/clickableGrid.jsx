import React, { useState } from "react";
import Modal from "../modal/modal";
import GridMap from "../gridMap/gridMap";
import { NotificationManager} from "../notifications/notification";

import "./clickableGrid.css";

const ClickableGrid = ({ rows, cols, onCellClick, time}) => {
  const [clicks, setClicks] = useState({
    firstClick: null,
    secondClick: null,
    firstClickTime: null,
    timeBetweenClicks: null,
  });

  const [modal, setModal] = useState({
    isOpen: false,
    question: "",
    options: [],
    onConfirm: () => {},
  });

  const resetClicks = () => setClicks({
    firstClick: null,
    secondClick: null,
    firstClickTime: null,
    timeBetweenClicks: null,
  });  

  const handleCellClick = (row, col) => {
    const currentTime = time || new Date().getTime();

    if (!clicks.firstClick) {
      setClicks({
        ...clicks,
        firstClick: { row, col },
        firstClickTime: currentTime,
      });
      NotificationManager.info("First click recorded!");
    } else if (!clicks.secondClick) {
      const timeDifference = (currentTime - clicks.firstClickTime) / 1000;

      const newClickData = {
        firstClick: clicks.firstClick,
        secondClick: { row, col },
        secondClickTime: currentTime,
        timeBetweenClicks: (currentTime - clicks.firstClickTime) / 1000,
        shotOccurred: null,
        goalScored: null,
      };

      setClicks({
        firstClick: clicks.firstClick,
        secondClick: { row, col },
        timeBetweenClicks: timeDifference,
      });

      setModal({
        isOpen: true,
        question: "Did a shot happen?",
        options: ["Yes", "No"],
        onConfirm: (shotOccurred) => {
          if (shotOccurred === "Yes") {
            setModal({
              isOpen: true,
              question: "Did the shot lead to a goal?",
              options: ["Yes", "No"],
              onConfirm: (goalScored) => {
                onCellClick({
                  ...newClickData,
                  shotOccurred,
                  goalScored,
                });
                NotificationManager.success("Action added successfully!");
                setModal({ isOpen: false });
                resetClicks();
              },
            });
          } else {
            onCellClick({
              ...newClickData,
              shotOccurred,
              goalScored: null,
            });
            NotificationManager.success("Action added successfully!");
            setModal({ isOpen: false });
            resetClicks();
          }
        },
      });
    } else {
      NotificationManager.info("First click recorded!");
      setClicks({
        firstClick: { row, col },
        firstClickTime: currentTime,
        secondClick: null,
        timeBetweenClicks: null,
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Record plays</h1>
      <div className="grid-container">
        <GridMap rows={rows} cols={cols} onCellClick={handleCellClick} />
      </div>
      <Modal
        isOpen={modal.isOpen}
        question={modal.question}
        options={modal.options}
        onConfirm={modal.onConfirm}
        onClose={() => setModal({ isOpen: false })}
      />
    </div>
  );
};

export default ClickableGrid;
