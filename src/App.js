import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setDoc, doc, getDoc } from "firebase/firestore";

import db from "./firebase";
import "./style/App.css";
import Game from "./components/Game";
import { useCookies } from "react-cookie";

function App() {

  const [cookies, setCookie] = useCookies(['scav-hunt']);

  const [isGameMode, setIsGameMode] = useState(cookies.gamePin && cookies.teamName);
  const [gamePin, setGamePin] = useState(cookies.gamePin || "");
  const [gameName, setGameName] = useState(cookies.gameName || "");
  const [teamName, setTeamName] = useState(cookies.teamName || "");

  

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
       
            setCookie('gamePin',  values.gamePin, { path: '/', maxAge: 7200 });
            setCookie('teamName', values.teamName, { path: '/', maxAge: 7200 });
            setCookie('gameName', (await getDoc(doc(db, "games", values.gamePin))).data().name, { path: '/', maxAge: 7200 });

            setGamePin(cookies.gamePin);
            setGameName(cookies.gameName);
            setTeamName(cookies.teamName);
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
