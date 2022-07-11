import { useState } from "react";
import { setDoc, doc, deleteDoc } from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import db from "../firebase";
import CreateClueForm from "./CreateClueForm";

function DashboardClueListItem(props) {
  return (
    <div>
      <p>Passcode: {props.passcode}</p>
      <p>Location: {props.location}</p>
      <p>Instructions: {props.instructions}</p>
      <p>Answer: {props.answer}</p>
      <p>Team Answer: {props.teamAnswer ? props.teamAnswer : ""}</p>
      <p>Points: {props.points ? props.points : 0}</p>
      <p>
        <button
          onClick={() => {
            for (let i = 0; i < props.teamData.clueList.length; i++) {
              if (props.teamData.clueList[i].id === props.id) {
                if(!props.teamData.clueList[i].correct) {
                  props.teamData.clueList[i].points += 500;
                  props.teamData.points += 500
                }
                props.teamData.clueList[i].correct = true;
              }
            }
            alert("Setting correct")
            setDoc(
              doc(db, "games", props.gamePin, "teams", props.teamName),
              props.teamData
            ).then(() => {
              props.invalidate(true);
            });
          }}
        >
          Correct
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < props.teamData.clueList.length; i++) {
              if (props.teamData.clueList[i].id === props.id) {
                if(props.teamData.clueList[i].correct) {
                  props.teamData.clueList[i].points -= 500;
                  props.teamData.points -= 500
                }
                props.teamData.clueList[i].correct = false;
              }
            }
            alert("Setting incorrect")
            setDoc(
              doc(db, "games", props.gamePin, "teams", props.teamName),
              props.teamData
            ).then(() => {
              props.invalidate(true);
            });
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
