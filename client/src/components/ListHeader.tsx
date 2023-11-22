import React from "react";
import Modal from "./Modal";
import { useState } from "react";
import { useCookies } from "react-cookie";

interface ListHeaderProps {
  listName: string;
  getData: () => void;
}

function ListHeader({ listName, getData }: ListHeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [, , removeCookie] = useCookies(["email", "AuthToken"]);

  // sign out the user by removing cookies and reloading the page
  const signOut = () => {
    removeCookie("email");
    removeCookie("AuthToken");
    window.location.reload();
  };

  return (
    <div className="list-header">
      <h1 className="list-header__title">{listName}</h1>
      <div className="buttons">
        <button className="buttons__create" onClick={() => setShowModal(true)}>
          ADD NEW
        </button>
        <button className="buttons__signout" onClick={signOut}>
          SIGNOUT
        </button>
      </div>
      {showModal && (
        <Modal mode={"create"} setShowModal={setShowModal} getData={getData} job={{
          id: "",
          user_email: "",
          title: "",
          status: "",
          date: "",
          icon_src: "",
          icon_id: "",
          link: undefined,
          note: undefined
        }} />
      )}
    </div>
  );
}

export default ListHeader;
