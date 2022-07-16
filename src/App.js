import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setDoc, doc, getDoc } from "firebase/firestore";

import "./style/App.css";

import db from "./firebase";
import Game from "./components/Game";

function App() {
  const [cookies, setCookie] = useCookies(["scav-hunt"]);

  const [isGameMode, setIsGameMode] = useState(
    (cookies.gamePin && cookies.teamName) !== undefined || false
  );
  const [gamePin, setGamePin] = useState(cookies.gamePin || "");
  const [gameName, setGameName] = useState(cookies.gameName || "");
  const [teamName, setTeamName] = useState(cookies.teamName || "");

  if (isGameMode) {
    return (
      <div className="App">
        <div className="Floating-form game-form">
          <Game gamePin={gamePin} gameName={gameName} teamName={teamName} />
        </div>
      </div>
    );
  }
  return (
    <div className="App">
      <div className="Floating-form">
        <h1>Welcome to the Scavenger Hunt!</h1>
        <Formik
          initialValues={{ teamName: "", gamePin: "" }}
          validate={async (values) => {
            const regex = new RegExp("[0-9]{4}$");
            const errors = {};
            if (!values.teamName) {
              errors.teamName = "Required";
            }
            if (!values.gamePin || !regex.test(values.gamePin)) {
              errors.gamePin = "Game pin must be exactly four numbers";
            }
            return errors;
          }}
          onSubmit={async (values, { resetForm }) => {
            alert("44");
            if (
              (
                await getDoc(
                  doc(db, "games", values.gamePin, "teams", values.teamName)
                )
              ).exists() ||
              !(await getDoc(doc(db, "games", values.gamePin))).exists()
            ) {
              alert("22");
              resetForm();
            }
            alert("23");
            await setDoc(
              doc(db, "games", values.gamePin, "teams", values.teamName),
              { name: values.teamName }
            );
            alert("24");
            let iGameName = (
              await getDoc(doc(db, "games", values.gamePin))
            ).data().name;
            setCookie("gamePin", values.gamePin, { path: "/" });
            setCookie("teamName", values.teamName, { path: "/" });
            setCookie("gameName", iGameName, { path: "/" });

            setGamePin(values.gamePin);
            setGameName(iGameName);
            setTeamName(values.teamName);
            setIsGameMode(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <p>
                Team Name: <Field name="teamName" />
              </p>
              <ErrorMessage name="teamName" component="p" />

              <p>
                Game Pin: <Field name="gamePin" />
              </p>
              <ErrorMessage name="gamePin" component="p" />

              <button type="submit" disabled={isSubmitting}>
                Join Now!
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default App;
