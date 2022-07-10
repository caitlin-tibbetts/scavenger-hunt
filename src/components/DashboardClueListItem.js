import { useState } from "react";
import { setDoc, doc, deleteDoc } from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import db from "../firebase";
import CreateClueForm from "./CreateClueForm";

function DashboardClueListItem(props) {
  return (
    <div>
      <p>Passcode: {props.id.slice(0, 6)}</p>
      <p>Location: {props.location}</p>
      <p>Instructions: {props.instructions}</p>
      <p>Answer: {props.answer}</p>
      <p>Team Answer: {props.teamAnswer}</p>
      <p>
        <button
          onClick={() => {
            console.log("correct");
          }}
        >
          Correct
        </button>
        <button
          onClick={() => {
            console.log("incorrect");
          }}
        >
          Incorrect
        </button>
      </p>
      <hr />
    </div>
  );
}

export default DashboardClueListItem;
