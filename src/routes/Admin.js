import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setDoc, doc, getDoc } from "firebase/firestore";

import "../style/App.css";
import "../style/Admin.css";

import db from "../firebase";
import AdminForm from "../components/AdminForm";

function Admin() {
  const [gamePin, setGamePin] = useState("");
  const [isGamePinSet, setIsGamePinSet] = useState(false);
  const [createGame, setCreateGame] = useState(false);

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
      onSubmit={(values, { setSubmitting }) => {
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
            <button
              onClick={() => {
                setCreateGame(true);
              }}
            >
              Create new Game
            </button>
          </p>
          <ErrorMessage name="gamePin" component="p" />
        </Form>
      )}
    </Formik>
  );

  if (createGame) {
    return (
      <div className="App">
        <div className="Floating-form">
          <Formik
            initialValues={{ gamePin: "", gameTitle: "" }}
            validate={async (values) => {
              const regex = new RegExp("[0-9]{4}$");
              const errors = {};
              if (!values.gamePin || !regex.test(values.gamePin)) {
                errors.gamePin = "Game pin must be exactly four numbers";
              }
              if (!values.gameTitle) {
                errors.gameTitle = "Required";
              }
              return errors;
            }}
            onSubmit={async (values) => {
              await setDoc(doc(db, "games", values.gamePin), {
                name: values.gameTitle,
              });
              setCreateGame(false);
              setIsGamePinSet(true);
              setGamePin(values.gamePin);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <p>
                  Game Pin: <Field name="gamePin" />
                  <ErrorMessage name="gamePin" component="p" />
                </p>
                <p>
                  Game Title: <Field name="gameTitle" />
                  <ErrorMessage name="gameTitle" component="p" />
                </p>
                <button type="submit" disabled={isSubmitting}>
                  Create
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  } else if (isGamePinSet) {
    return (
      <div className="App">
        <div className="Floating-form">
          {gamePinForm}
          <AdminForm gamePin={gamePin} />
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

export default Admin;
