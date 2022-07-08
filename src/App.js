import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setDoc, doc, getDoc } from "firebase/firestore";

import db from "./firebase";
import "./style/App.css";
import Game from "./components/Game";

function App() {
  const [isGameMode, setIsGameMode] = useState(false);
  const [gamePin, setGamePin] = useState("");
  const [gameName, setGameName] = useState("");
  const [teamName, setTeamName] = useState("");

  if (isGameMode) {
    return (
      <div className="App">
        <div className="Floating-form">
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
            if (
              (
                await getDoc(
                  doc(db, "games", values.gamePin, "teams", values.teamName)
                )
              ).exists() ||
              !(await getDoc(doc(db, "games", values.gamePin))).exists()
            ) {
              resetForm();
            }
            await setDoc(
              doc(db, "games", values.gamePin, "teams", values.teamName),
              { name: values.teamName }
            );
            setGamePin(values.gamePin);
            setGameName(
              (await getDoc(doc(db, "games", values.gamePin))).data().name
            );
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
