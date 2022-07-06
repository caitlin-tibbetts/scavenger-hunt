import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import ReactCardFlip from "react-card-flip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";

import "../style/App.css";
import "../style/Game.css";
import { setDoc, getDoc, doc } from "firebase/firestore";
import db from "../firebase";

function ClueCard(props) {
  const [showBack, setShowBack] = useState(false);
  const [status, setStatus] = useState(0);
  const [teamData, setTeamData] = useState();
  useEffect(() => {
    async function getTeamData() {
      setTeamData(
        (
          await getDoc(doc(db, "games", props.gamePin, "teams", props.teamName))
        ).data()
      );
    }
    getTeamData().then(() => {
      for (let i = 0; i < teamData.clueList.length; i++) {
        if (teamData.clueList[i].id === props.id) {
          setStatus(teamData.clueList[i].status);
        }
      }
    });
  });
  if (status === 1) {
    return (
      <Card
        elevation={12}
        className="clue-front"
        style={{ position: "relative" }}
      >
        <h2>Clue #{props.index}</h2>
        <p>{props.location}</p>
        <Formik
          initialValues={{ passcode: "" }}
          validate={async (values) => {
            const errors = {};
            if (!values.passcode) {
              errors.passcode = "Required";
            }
            return errors;
          }}
          onSubmit={async (values, { resetForm }) => {
            if (values.passcode === props.passcode) {
              let iTeamData = teamData;
              for (let i = 0; i < iTeamData.clueList.length; i++) {
                if (iTeamData.clueList[i].id === props.id) {
                  iTeamData.clueList[i].status = 2;
                }
              }
              await setDoc(
                doc(db, "games", props.gamePin, "teams", props.teamName),
                iTeamData
              );
              setTeamData(iTeamData);
              setShowBack(true);
              setStatus(2);
            } else {
              resetForm();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <p>
                Passcode (case sensitive): <Field name="passcode" />
                <ErrorMessage name="passcode" component="p" />
              </p>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </Card>
    );
  }
  if (status === 2) {
    return (
      <div className="clue">
        <ReactCardFlip isFlipped={showBack} flipDirection="vertical">
          <Card
            elevation={12}
            className="clue-front"
            style={{ position: "relative" }}
          >
            <h2>Clue #{props.index}</h2>
            <p>{props.location}</p>
            <FontAwesomeIcon
              icon={faAngleDown}
              onClick={() => setShowBack(!showBack)}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "25%",
              }}
            />
          </Card>

          <Card
            elevation={12}
            className="clue-back"
            style={{ position: "relative" }}
          >
            <p>{props.instructions}</p>
            <Formik
              initialValues={{ answer: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.answer) {
                  errors.answer = "Required";
                }
                return errors;
              }}
              onSubmit={async (values, { resetForm }) => {
                if (values.answer === props.answer) {
                  let iTeamData = teamData;
                  let nextCard = false;
                  for (let i = 0; i < iTeamData.clueList.length; i++) {
                    if (iTeamData.clueList[i].id === props.id) {
                      iTeamData.clueList[i].status = 3;
                      setStatus(3);
                      nextCard = true;
                    }
                    if (nextCard) {
                      iTeamData.clueList[i].status = 1;
                      nextCard = false;
                    }
                  }
                  await setDoc(
                    doc(db, "games", props.gamePin, "teams", props.teamName),
                    iTeamData
                  );
                  setTeamData(iTeamData);
                } else {
                  resetForm();
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <p>
                    Answer: <Field name="answer" />
                  </p>
                  <ErrorMessage name="answer" component="p" />
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            <FontAwesomeIcon
              icon={faAngleDown}
              onClick={() => setShowBack(!showBack)}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "25%",
              }}
            />
          </Card>
        </ReactCardFlip>
      </div>
    );
  } else if (status === 3) {
    return (
      <div className="clue">
        <ReactCardFlip isFlipped={showBack} flipDirection="vertical">
          <Card
            elevation={12}
            className="clue-front"
            style={{ position: "relative" }}
          >
            <h2>Clue #{props.index}</h2>
            <p>{props.location}</p>
            <p>Finished!</p>
            <FontAwesomeIcon
              icon={faAngleDown}
              onClick={() => setShowBack(!showBack)}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "25%",
              }}
            />
          </Card>

          <Card
            elevation={12}
            className="clue-back"
            style={{ position: "relative" }}
          >
            <p>{props.instructions}</p>
            <p>Finished! Answer: {props.answer}</p>
            <FontAwesomeIcon
              icon={faAngleDown}
              onClick={() => setShowBack(!showBack)}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "25%",
              }}
            />
          </Card>
        </ReactCardFlip>
      </div>
    );
  }
}

export default ClueCard;
