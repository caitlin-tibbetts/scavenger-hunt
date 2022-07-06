import React, { useState } from "react";
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

import ClueListItem from "../components/ClueListItem";
import CreateClueForm from "../components/CreateClueForm";

import db from "../firebase";

function Admin() {
  const [gamePin, setGamePin] = useState("");
  const [isGamePinSet, setIsGamePinSet] = useState(false);
  const [createGame, setCreateGame] = useState(false);
  const [clueList, setClueList] = useState([]);

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
            onSubmit={async (values, { setSubmitting }) => {
              setGamePin(values.gamePin);
              await setDoc(doc(db, "games", values.gamePin), {
                name: values.gameTitle,
              });
              await addDoc(collection(db, "games", values.gamePin, "clues"), {
                location: "",
                answer: "",
                instructions: "",
              });
              await addDoc(collection(db, "games", values.gamePin, "teams"), {
                name: "",
              });
              setIsGamePinSet(true);
              setSubmitting(false);
              setCreateGame(false);
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
    getDocs(collection(db, "games", gamePin, "clues")).then((clues) => {
      setClueList(
        clues.docs.map((value, index) => {
          return { data: value.data(), id: value.id };
        })
      );
    });
    return (
      <div className="App">
        <div className="Floating-form">
          {gamePinForm}
          <div className="container">
            <div className="form">
              <CreateClueForm
                gamePin={gamePin}
                submitButtonText="Add Clue"
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  await addDoc(collection(db, "games", gamePin, "clues"), {
                    location: values.location,
                    instructions: values.instructions,
                    answer: values.answer,
                  });
                  resetForm();
                  setSubmitting(false);
                }}
              />
            </div>
            <div className="clues">
              {clueList.map((value, index) => {
                if (value.data.answer !== "") {
                  return (
                    <ClueListItem
                      key={value.id}
                      id={value.id}
                      location={value.data.location}
                      instructions={value.data.instructions}
                      answer={value.data.answer}
                      gamePin={gamePin}
                    />
                  );
                }
                return null;
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

export default Admin;
