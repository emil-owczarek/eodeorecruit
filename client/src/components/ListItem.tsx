import { useState } from "react";
import Modal from "./Modal";
import NoteModal from "./NoteModel";
import React from "react";
import { Job } from "../types/job";

const ListItem = ({ job, getData }: { job: Job; getData: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // colors of status dots
  const statusColorMap: Record<string, string> = {
    "CV Sent": "green",
    "Test Task Assigned": "lightgreen",
    "HR Interview": "Gold",
    "Technical Interview": "orange",
    "Offer Received": "CornflowerBlue",
    "Application Rejected": "Crimson",
    "Application Closed": "gray",
  };

  // format a link, adding "https://" if missing
  const formatLink = (link: string) => {
    if (link && (link.startsWith("http://") || link.startsWith("https://"))) {
      return link;
    } else if (link) {
      return `https://${link}`;
    }
    return;
  };

  const deleteItem = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/jobs/${job.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="list-item">
      <div className="info-container">
        <img
          className="list-item__icon selected"
          src={job.icon_src}
          alt="job board icon"
        />
        <a
          href={formatLink(job.link || "")}
          className="list-item__job-title"
          target="_blank"
          rel="noopener noreferrer"
        >
          {job.title}
        </a>
        <div className="list-item__job-status">
          <span
            className="list-item__status-dot"
            style={{ backgroundColor: statusColorMap[job.status] || "black" }}
          ></span>
          {job.status}
        </div>
      </div>

      <div className="buttons">
        <button
          className="buttons__note"
          onClick={() => setShowNoteModal(true)}
        >
          NOTE
        </button>
        <button className="buttons__edit" onClick={() => setShowModal(true)}>
          EDIT
        </button>
        <button className="buttons__delete" onClick={deleteItem}>
          DELETE
        </button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          getData={getData}
          job={job}
        />
      )}
      {showNoteModal && (
        <NoteModal
          job={job}
          setShowNoteModal={setShowNoteModal}
          getData={getData}
          initialNote={job.note}
        />
      )}
    </div>
  );
};
export default ListItem;
