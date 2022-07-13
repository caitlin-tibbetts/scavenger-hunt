import React, { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field } from "formik";

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

  const [addingPoints, setAddingPoints] = useState(false);

  if (props.teamAnswer) {
    if (addingPoints) {
      return (
        <div>
          <h1>Clue #{props.index}</h1>
          <div className="container">
            <div className="left">
              <p>Passcode: {props.id.slice(0, 6)}</p>
              <p>Location: {props.location}</p>
              <p>Instructions: {props.instructions}</p>
              <p>Correct Answer: {props.answer}</p>
              <p>Team Answer: {props.teamAnswer ? props.teamAnswer : ""}</p>
            </div>
            <div className="right">
              <p>{statusString}</p>
              <Formik
                initialValues={{ points: Math.round(props.points) }}
                validate={(values) => {
                  return {};
                }}
                onSubmit={(values, { setSubmitting }) => {
                  for (let i = 0; i < props.teamData.clueList.length; i++) {
                    if (props.teamData.clueList[i].id === props.id) {
                      props.teamData.points -= props.teamData.clueList[i].points
                      props.teamData.clueList[i].points = parseInt(values.points)
                      props.teamData.points += parseInt(values.points)
                    }
                  }
                  setDoc(
                    doc(db, "games", props.gamePin, "teams", props.teamName),
                    props.teamData
                  ).then();
                  setAddingPoints(false);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <p>
                      <Field name="points" />
                      <button type="submit" disabled={isSubmitting}>
                        Update
                      </button>
                    </p>
                  </Form>
                )}
              </Formik>
              <h1>
                {props.correct ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faX} />
                )}
              </h1>
            </div>
          </div>
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
    } else {
      return (
        <div>
          <h1>Clue #{props.index}</h1>
          <div className="container">
            <div className="left">
              <p>Passcode: {props.id.slice(0, 6)}</p>
              <p>Location: {props.location}</p>
              <p>Instructions: {props.instructions}</p>
              <p>Correct Answer: {props.answer}</p>
              <p>Team Answer: {props.teamAnswer ? props.teamAnswer : ""}</p>
            </div>
            <div className="right">
              <p>{statusString}</p>
              <p>
                {props.points ? Math.round(props.points) : 0}{" "}
                <FontAwesomeIcon
                  icon={faPencil}
                  onClick={() => {
                    setAddingPoints(true);
                  }}
                />
              </p>
              <h1>
                {props.correct ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faX} />
                )}
              </h1>
            </div>
          </div>
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
  }
  return (
    <div>
      <h1>Clue #{props.index}</h1>
      <div className="container">
        <div className="left">
          <p>Passcode: {props.id.slice(0, 6)}</p>
          <p>Location: {props.location}</p>
          <p>Instructions: {props.instructions}</p>
          <p>Correct Answer: {props.answer}</p>
        </div>
        <div className="right">
          <p>{statusString}</p>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default DashboardClueListItem;
