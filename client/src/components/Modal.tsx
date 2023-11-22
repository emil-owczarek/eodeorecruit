import { useState } from "react";
import { useCookies } from "react-cookie";
import { icons, statuses } from "./constans";
import React from "react";
import { Job } from "../types/job";
import { icon } from "../types/icon";

interface ModalProps {
  mode: string;
  setShowModal: (show: boolean) => void;
  getData: () => void;
  job: Job;
}

const Modal: React.FC<ModalProps> = ({ mode, setShowModal, getData, job }) => {
  const [cookies] = useCookies<string>([]);

  const isEditMode = mode === "edit" ? true : false;

  const initialIcon = isEditMode
    ? icons.find((icon) => icon.src === job.icon_src) || icons[5]
    : icons.find((icon) => icon.id === "Other") || icons[5];

  const [selectedIcon, setSelectedIcon] = useState(initialIcon.id);
  const [data, setData] = useState({
    user_email: isEditMode ? job.user_email : cookies.email,
    title: isEditMode ? job.title : "",
    link: isEditMode ? job.link : "",
    status: isEditMode ? job.status : "CV Sent",
    selectedIcon: initialIcon,
    date: isEditMode ? job.date : new Date(),
  });

  const handleIconSelect = (icon: icon) => {
    setSelectedIcon(icon.id);
    setData({ ...data, selectedIcon: icon });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const postData = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/jobs/${job.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
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
          <h3> Let's {mode} your job post</h3>
          <button
            className="modal__close-button"
            onClick={() => setShowModal(false)}
          >
            X
          </button>
        </div>

        <div>
          <h4>Select a job board</h4>
          {icons.map((icon) => (
            <img
              key={icon.id}
              className={`list-item__icon ${
                selectedIcon === icon.id ? "selected" : ""
              }`}
              src={icon.src}
              alt={icon.alt}
              onClick={() => handleIconSelect(icon)}
            />
          ))}
        </div>

        <form
          className="modal__form"
          onSubmit={isEditMode ? editData : postData}
        >
          <h4 className="modal__title">Add position and/or company</h4>
          <input
            className="modal__input"
            required
            maxLength={30}
            placeholder=" e.g. Team Lead - Google"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <h4 className="modal__title">Add link to the job post</h4>
          <input
            className="modal__input"
            maxLength={100}
            placeholder=" e.g. https://www.linkedin.com/jobs/view/12345678910 (optional)"
            name="link"
            value={data.link}
            onChange={handleChange}
          />
          <h4 className="modal__title">Select Application Status</h4>
          <select
            className="modal__status-select"
            name="status"
            value={data.status}
            onChange={handleChangeSelect}
            required
          >
            {statuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input className="modal__submit-button" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Modal;
