import React from "react";
import { useState } from "react";
import { Job } from "../types/job";

interface NoteModalProps {
  job: Job
  setShowNoteModal: (show: boolean) => void;
  getData: () => void;
  initialNote?: string;
}

const NoteModal: React.FC<NoteModalProps> = ({
  job,
  setShowNoteModal,
  getData,
  initialNote,
}) => {
  const [noteText, setNoteText] = useState(initialNote || "");

  const saveNote = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/jobs/${job.id}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes: noteText }),
        }
      );

      if (response.status === 200) {
        setShowNoteModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__form-title-container">
          <h2>{job.title}</h2>
          <button className="modal__close-button" onClick={() => saveNote()}>
            X
          </button>
        </div>
        <textarea
          className="modal__textarea"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NoteModal;
