import "./modal.css"; // Add CSS for styling the modal

const Modal = ({ isOpen, onClose, onConfirm, question, options }) => {
  if (!isOpen) return null; 

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{question}</p>
        <div className="modal-buttons">
          {options.map((option, index) => (
            <button key={index} onClick={() => onConfirm(option)}>
              {option}
            </button>
          ))}
        </div>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
