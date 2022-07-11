import React, {useEffect, useState} from "react";
import {
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

import db from "../firebase";
import CreateClueForm from "./CreateClueForm";
import AdminClueListItem from "./AdminClueListItem";

function AdminForm(props) {
    const [clueList, setClueList] = useState([]);
    useEffect(() => {
        const unsubscribeClues = onSnapshot(collection(db, "games", props.gamePin, "clues"), (snapshot) => {
          setClueList(snapshot.docs.map((value, index) => {
            let iClueData = value.data()
            iClueData.id = value.id
            return iClueData
          }))
        })
    
        return (() => {
          unsubscribeClues();
        })
      }, [props.gamePin]);
  return (
    <div className="container">
      <div className="form">
        <CreateClueForm
          gamePin={props.gamePin}
          submitButtonText="Add Clue"
          onSubmit={async (values, { resetForm }) => {
            await addDoc(collection(db, "games", props.gamePin, "clues"), {
              location: values.location,
              instructions: values.instructions,
              answer: values.answer,
            });
            resetForm();
          }}
        />
      </div>
      <div className="clues">
        {clueList &&
          clueList.map((value, index) => {
            return (
              <AdminClueListItem
                key={value.id}
                gamePin={props.gamePin}
                id={value.id}
                location={value.location}
                instructions={value.instructions}
                answer={value.answer}
              />
            );
          })}
      </div>
    </div>
  );
}

export default AdminForm;
