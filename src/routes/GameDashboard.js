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
import { useRef } from "react";

function GameDashboard() {
  const [gamePin, setGamePin] = useState("");
  const [isGamePinSet, setIsGamePinSet] = useState(false);
  const [teamData, setTeamData] = useState();
  const [teamList, setTeamList] = useState([]);
  const [invalidated, invalidate] = useState(true);
  const [totalTeamPoints, setTotalTeamPoints] = useState(0);

  const [isCurrentTeamSet, setIsCurrentTeamSet] = useState(false);
  const [currentTeam, setCurrentTeam] = useState("");
  const currentTeamRef = useRef();

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
    if (invalidated && isGamePinSet && teamList.length === 0) {
      getTeams().then((iTeamList) => {
        setTeamList(iTeamList);
      });
      invalidate(false);
    }
    if (
      invalidated &&
      isGamePinSet &&
      isCurrentTeamSet &&
      currentTeamRef.current !== currentTeam
    ) {
      getClues().then((iTeamData) => {
        let iPoints = 0;
        iTeamData.clueList.forEach((clue) => {
          iPoints +=
            clue.points +
            (300 - (clue.endTime.seconds - clue.startTime.seconds));
        });
        setTotalTeamPoints(iPoints);
        setTeamData(iTeamData);
        invalidate(false);
        currentTeamRef.current = currentTeam;
      });
    }
  }, [
    gamePin,
    currentTeam,
    isGamePinSet,
    isCurrentTeamSet,
    invalidated,
    teamList.length,
  ]);

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

  if (isGamePinSet && !isCurrentTeamSet) {
    return (
      <div className="App">
        <div className="Floating-form">
          {gamePinForm}
          <div className="container">
            <div className="teams">
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
            <div className="clues">
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
            <div className="teams">
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
            <div className="clues">
              Total Points: {totalTeamPoints}
              {teamData &&
                teamData.clueList.map((value, i) => {
                  return (
                    <DashboardClueListItem
                      key={value.id}
                      id={value.id}
                      teamData={teamData}
                      status={value.status}
                      passcode={value.id.slice(0, 6)}
                      index={i + 1}
                      answer={value.answer}
                      teamAnswers={value.teamAnswers}
                      points={value.points}
                      instructions={value.instructions}
                      location={value.location}
                      invalidate={invalidated}
                    />
                  );
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
