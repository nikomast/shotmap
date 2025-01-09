import React, { useState } from "react";
import { endMatch } from "../../../utility/api"; 
import Modal from "../../components/modal/modal";
import { NotificationManager } from "../../components/notifications/notification";
import "./endMatchButton.css";

const EndMatchButton = ({ matchId, onMatchEnded }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    question: "",
    options: [],
    onConfirm: () => {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEndMatchClick = () => {
    setModal({
      isOpen: true,
      question: "What was the result of the match?",
      options: ["W - Win", "D - Draw", "L - Loss"],
      onConfirm: async (selectedOption) => {
        const result = selectedOption.split(" ")[0]; 
        setModal({ isOpen: false });
        await endMatchRequest(result);
      },
    });
  };

  const endMatchRequest = async (result) => {
    setLoading(true);
    setError(null);
    try {
      const response = await endMatch(matchId, result);
      NotificationManager.success("Match ended successfully!");
      if (onMatchEnded) onMatchEnded();
    } catch (err) {
      setError(err.error || "Failed to end match. Please try again.");
      NotificationProvider.error("Failed to end match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleEndMatchClick} className="stop-match" disabled={loading}>
        {loading ? "Ending Match..." : "End Match"}
      </button>
      {error && <p className="error-message">{error}</p>}
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

export default EndMatchButton;
