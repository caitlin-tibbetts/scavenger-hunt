import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { doc, getDoc } from "firebase/firestore";

import "../style/App.css";
import "../style/Leaderboard.css";

import db from "../firebase";
import ScoreList from "../components/ScoreList";

function Leaderboard() {
  const [gamePin, setGamePin] = useState("");
  const [gameName, setGameName] = useState("");
  const [isGamePinSet, setIsGamePinSet] = useState(false);

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
        setGamePin(values.gamePin);
        setIsGamePinSet(true);
        setSubmitting(false);

        let iGameName = (await getDoc(doc(db, "games", values.gamePin))).data()
          .name;

        setGameName(iGameName);
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
        <div className="Floating-form score-form">
          <ScoreList gamePin={gamePin} gameName={gameName} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <div className="Leaderboard Floating-form">{gamePinForm}</div>
      </div>
    );
  }
}

export default Leaderboard;
