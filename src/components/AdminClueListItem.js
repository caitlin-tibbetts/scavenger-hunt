import { useState } from "react";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import db from "../firebase";
import CreateClueForm from "./CreateClueForm";

function AdminClueListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <>
        <FontAwesomeIcon
          icon={faX}
          onClick={async () => {
            await deleteDoc(doc(db, "games", props.gamePin, "clues", props.id));
          }}
        />
        <CreateClueForm
          gamePin={props.gamePin}
          initialLocation={props.location}
          initialInstructions={props.instructions}
          initialAnswer={props.answer}
          initialLink={props.link}
          submitButtonText="Update Clue"
          onSubmit={async (values) => {
            await setDoc(doc(db, "games", props.gamePin, "clues", props.id), {
              location: values.location,
              instructions: values.instructions,
              answer: values.answer,
              link: values.link || ""
            });
            setIsEditing(false);
          }}
        />
        <hr />
      </>
    );
  } else {
    return (
      <div>
        {props.link ? <img src={props.link} alt="Clue"/> : ""}
        <p>Passcode: {props.id.slice(0, 6)}</p>
        <p>Location: {props.location}</p>
        <p>Instructions: {props.instructions}</p>
        <p>Answer: {props.answer}</p>
        <button
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Edit
        </button>
        <hr />
      </div>
    );
  }
}

export default AdminClueListItem;
