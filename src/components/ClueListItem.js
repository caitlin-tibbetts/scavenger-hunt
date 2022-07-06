import { useState } from "react";

import { setDoc, doc } from "firebase/firestore";
import db from "../firebase";
import CreateClueForm from "./CreateClueForm";

function ClueListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <CreateClueForm
        gamePin={props.gamePin}
        submitButtonText="Update Clue"
        onSubmit={async (values, { setSubmitting }) => {
          await setDoc(doc(db, "games", props.gamePin, "clues", props.id), {
            location: values.location,
            instructions: values.instructions,
            answer: values.answer,
          });
          setIsEditing(false);
          setSubmitting(false);
        }}
      />
    );
  } else {
    return (
      <div>
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

export default ClueListItem;
