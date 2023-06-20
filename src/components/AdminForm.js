import React, { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

import "../style/Admin.css";

import db from "../firebase";
import CreateClueForm from "./CreateClueForm";
import AdminClueListItem from "./AdminClueListItem";

function AdminForm(props) {
  const [clueList, setClueList] = useState([]);

  const [createNewClue, setCreateNewClue] = useState(false);

  useEffect(() => {
    const unsubscribeClues = onSnapshot(
      collection(db, "games", props.gamePin, "clues"),
      (snapshot) => {
        setClueList(
          snapshot.docs.map((value) => {
            let iClueData = value.data();
            iClueData.id = value.id;
            return iClueData;
          })
        );
      }
    );

    return () => {
      unsubscribeClues();
    };
  }, [props.gamePin]);
  return (
    createNewClue ? (
      // <div className="containerAdmin">
      <div className="form" >
        < CreateClueForm
          gamePin={props.gamePin}
          submitButtonText="Add Clue"
          cancelCreateNewCard={setCreateNewClue}
          onSubmit={async (values, { resetForm }) => {
            await addDoc(collection(db, "games", props.gamePin, "clues"), {
              location: values.location,
              instructions: values.instructions,
              link: values.link ? values.link : "",
              answer: values.answer,
            });
            resetForm();
          }
          }
        />
      </div >
    )
      :
      (
        <div className="adminClues">

          <div className="wrap-login100-form-btn" style={{ width: 120 }}>
            <div className="login100-form-bgbtn"></div>
            <button
              className="login100-form-btn"
              onClick={() => {
                setCreateNewClue(true);
              }}
            >
              Add New Clue
            </button>
          </div>
          <hr />
          {
            clueList &&
            clueList.map((value) => {
              return (
                <AdminClueListItem
                  key={value.id}
                  gamePin={props.gamePin}
                  id={value.id}
                  location={value.location}
                  instructions={value.instructions}
                  answer={value.answer}
                  link={value.link || ""}
                />
              );
            })
          }
        </div >
      )
    // </div >
  );

}

export default AdminForm;
