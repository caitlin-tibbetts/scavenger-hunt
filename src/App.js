import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setDoc, doc, getDoc } from "firebase/firestore";

import "./style/App.css";

import db from "./firebase";
import Game from "./components/Game";
import store from "store2";

// store.local({
//   gamepin: store.get("gamepin") || "",
//   gamename: store.get("gamename") || "",
//   teamname: store.get("teamname") || ""

// })

function App() {



  const [isGameMode, setIsGameMode] = useState(
    store.session.get("gamepin") && store.session.get("teamname")
  );

  if (isGameMode) {
    return (
      <div className="App">
        <div className="Floating-form game-form">
          <Game gamePin={store.session.get("gamepin")}
            gameName={store.session.get("gamename")}
            teamName={store.session.get("teamname")} />
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
            let iGameName = (
              await getDoc(doc(db, "games", values.gamePin))
            ).data().name;

            store.session({
              gamepin: values.gamePin,
              gamename: iGameName,
              teamname: values.teamName

            })
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
