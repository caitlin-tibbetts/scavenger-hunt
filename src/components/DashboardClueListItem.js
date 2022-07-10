import { useState } from "react";
import { setDoc, doc, deleteDoc } from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import db from "../firebase";
import CreateClueForm from "./CreateClueForm";

function DashboardClueListItem(props) {
  return (
    <div>
      <p>Passcode: {props.id}</p>
      <p>Location: {props.location}</p>
      <p>Instructions: {props.instructions}</p>
      <p>Answer: {props.answer}</p>
      {console.log(props.teamAnswers)}
      {props.teamAnswers && props.teamAnswers.map((teamAnswer, i) => {
        return (
          <p key={i}>
            Team Answer #{i+1}: {teamAnswer}
          </p>
        );
      })}

      <p>Points: {props.points}</p>
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
