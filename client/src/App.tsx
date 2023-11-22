import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import React from "react";
import { Job } from "./types/job";

function App() {
  const [cookies] = useCookies();
  const userEmail = cookies.email;
  const authToken = cookies.AuthToken;
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedJobBoard, setSelectedJobBoard] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleJobBoardChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedJobBoard(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const filteredJobs = jobs?.filter((job) => {
    return (
      job.title.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedJobBoard === "" || job.icon_id === selectedJobBoard) &&
      (selectedStatus === "" || job.status === selectedStatus)
    );
  });

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const userName = userEmail
    ? capitalizeFirstLetter(userEmail.split("@")[0])
    : "";

  const getData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/jobs/${userEmail}`
      );
      const json = await response.json();
      setJobs(json);
    } catch (e) {
      console.error(e);
    }
  }, [userEmail]);

  //only get data if there is an authorized user
  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [authToken, getData]);

  //if cookie not set, show the Auth Modal, otherwise get and show the list of items in the users database via their email.
  return (
    <div className={`app ${!authToken ? "transparent-background" : ""}`}>
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={`Hi, ${userName}!`} getData={getData} />

          <input
            className="app__search-input"
            style={{ display: "block" }}
            type="text"
            placeholder="Search job..."
            value={filter}
            onChange={handleFilterChange}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              paddingBottom: "20px",
            }}
          >
            <label htmlFor="board-select">Choose job board: </label>
            <select
              className="app__select"
              name="board"
              id="board-select"
              onChange={handleJobBoardChange}
            >
              <option value="">--Please choose an option--</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="NoFluffJobs">NoFluffJobs</option>
              <option value="JustJoinIT">JustJoinIT</option>
              <option value="BulldogJob">BulldogJob</option>
              <option value="Other">Other</option>
            </select>

            <label style={{ paddingLeft: "20px" }} htmlFor="status-select">
              Choose status:{" "}
            </label>
            <select
              className="app__select"
              name="status"
              id="status-select"
              onChange={handleStatusChange}
            >
              <option value="">--Please choose an option--</option>
              <option value="CV Sent">CV Sent</option>
              <option value="Test Task Assigned">Test Task Assigned</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Offer Received">Offer Received</option>
              <option value="Application Rejected">Application Rejected</option>
              <option value="Application Closed">Application Closed</option>
            </select>
          </div>

          {filteredJobs?.map((job) => (
            <ListItem key={job.id} job={job} getData={getData} />
          ))}
        </>
      )}
    </div>
  );
}
export default App;
