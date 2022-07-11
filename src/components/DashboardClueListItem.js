import React from "react";
import { setDoc, doc } from "firebase/firestore";

import db from "../firebase";

function DashboardClueListItem(props) {
  let statusString = "";
  if (props.status === 0) {
    statusString = "Not Started";
  } else if (props.status === 1) {
    statusString = "En Route";
  } else if (props.status === 2) {
    statusString = "In Progress";
  } else if (props.status === 3) {
    statusString = "Finished";
  }
  if (props.teamAnswer) {
    return (
      <div>
        <p>Passcode: {props.passcode}</p>
        <p>Status: {statusString}</p>
        <p>Location: {props.location}</p>
        <p>Instructions: {props.instructions}</p>
        <p>Answer: {props.answer}</p>
        <p>Team Answer: {props.teamAnswer ? props.teamAnswer : ""}</p>
        <p>Correct? {props.correct ? "Yes" : "No"}</p>
        <p>Points: {props.points ? Math.round(props.points) : 0}</p>
        <p>
          <button
            onClick={() => {
              for (let i = 0; i < props.teamData.clueList.length; i++) {
                if (props.teamData.clueList[i].id === props.id) {
                  if (!props.teamData.clueList[i].correct) {
                    props.teamData.clueList[i].points += 500;
                    props.teamData.points += 500;
                  }
                  props.teamData.clueList[i].correct = true;
                }
              }
              setDoc(
                doc(db, "games", props.gamePin, "teams", props.teamName),
                props.teamData
              ).then();
            }}
          >
            Correct
          </button>
          <button
            onClick={() => {
              for (let i = 0; i < props.teamData.clueList.length; i++) {
                if (props.teamData.clueList[i].id === props.id) {
                  if (props.teamData.clueList[i].correct) {
                    props.teamData.clueList[i].points -= 500;
                    props.teamData.points -= 500;
                  }
                  props.teamData.clueList[i].correct = false;
                }
              }
              setDoc(
                doc(db, "games", props.gamePin, "teams", props.teamName),
                props.teamData
              ).then();
            }}
          >
            Incorrect
          </button>
        </p>
        <hr />
      </div>
    );
  }
  return (
    <div>
      <p>Passcode: {props.passcode}</p>
      <p>Status: {statusString}</p>
      <p>Location: {props.location}</p>
      <p>Instructions: {props.instructions}</p>
      <p>Answer: {props.answer}</p>
      <hr />
    </div>
  );
}

export default DashboardClueListItem;
