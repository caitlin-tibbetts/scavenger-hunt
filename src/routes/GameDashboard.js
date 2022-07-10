import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../style/App.css";
import "../style/Admin.css";
import {
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import TeamListItem from "../components/TeamListItem";
import CreateClueForm from "../components/CreateClueForm";

import db from "../firebase";
import DashboardClueListItem from "../components/DashboardClueListItem";

function GameDashboard() {
  const [gamePin, setGamePin] = useState("");
  const [isGamePinSet, setIsGamePinSet] = useState(false);
  const [teamData, setTeamData] = useState();
  const [teamList, setTeamList] = useState([]);
  const [invalidated, invalidate] = useState(true);

  const [isCurrentTeamSet, setIsCurrentTeamSet] = useState(false);
  const [currentTeam, setCurrentTeam] = useState("");

  useEffect(() => {
    async function getClues() {
      alert("Getting clues");
      return (
        await getDoc(doc(db, "games", gamePin, "teams", currentTeam))
      ).data();
    }
    async function getTeams() {
      alert("Getting teams");
      return (
        await getDocs(collection(db, "games", gamePin, "teams"))
      ).docs.map((document) => {
        return document.data();
      });
    }
    if (invalidated && isGamePinSet) {
      getTeams().then((iTeamList) => {
        setTeamList(iTeamList);
      });
      invalidate(false);
    }
    if (invalidated && isGamePinSet && isCurrentTeamSet) {
      getClues().then((iTeamData) => {
        setTeamData(iTeamData);
      });
    }
  }, [gamePin, currentTeam, isGamePinSet, isCurrentTeamSet, invalidated]);

  const gamePinForm = (
    <Formik
      initialValues={{ gamePin: "" }}
      validate={async (values) => {
        const regex = new RegExp("[0-9]{4}$");
        const errors = {};
        if (!values.gamePin || !regex.test(values.gamePin)) {
          errors.gamePin = "Game pin must be exactly four numbers";
        }
        if (!(await getDoc(doc(db, "games", values.gamePin))).exists()) {
          errors.gamePin = "Game does not exist";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        invalidate(true);
        setGamePin(values.gamePin);
        setIsGamePinSet(true);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <p>
            Game Pin: <Field name="gamePin" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </p>
          <ErrorMessage name="gamePin" component="p" />
        </Form>
      )}
    </Formik>
  );

  if (isGamePinSet) {
    return (
      <div className="App">
        <div className="Floating-form">
          {gamePinForm}
          <div className="container">
            <div className="clues">
              {teamList &&
                teamList.map((value, index) => {
                  return (
                    <TeamListItem
                      key={value.name}
                      setCurrentTeam={setCurrentTeam}
                      teamName={value.name}
                      points={value.points}
                      setIsCurrentTeamSet={setIsCurrentTeamSet}
                      invalidate={invalidate}
                    />
                  );
                })}
            </div>
            <div className="form">
              <p>Pick a team!</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isGamePinSet && isCurrentTeamSet) {
    return (
      <div className="App">
        <div className="Floating-form">
          {gamePinForm}
          <div className="container">
            <div className="clues">
              {teamList &&
                teamList.map((value, index) => {
                  return (
                    <TeamListItem
                      key={value.name}
                      setCurrentTeam={setCurrentTeam}
                      teamName={value.name}
                      points={value.points}
                      setIsCurrentTeamSet={setIsCurrentTeamSet}
                    />
                  );
                })}
            </div>
            <div className="form">
              {teamData &&
                teamData.clueList.map((value, index) => {
                  console.log("Downhere", value);
                  return <DashboardClueListItem key={value.name} />;
                })}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <div className="Floating-form">{gamePinForm}</div>
      </div>
    );
  }
}

export default GameDashboard;
