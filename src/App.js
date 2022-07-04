import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { collection, addDoc, doc, getDoc } from "firebase/firestore"; 


import db from "./firebase";
import "./App.css";

function App() {

  return (
    <div className="App">
      <div className="Floating-form">
        <h1>Welcome to the Scavenger Hunt!</h1>
        <h2>Mequet Family Dauphin Island 2022</h2>
        <Formik
          initialValues={{ teamName: "", password: "", gamePin: "" }}
          validate={(values) => {
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
          onSubmit={async (values, { setSubmitting }) => {
            /*
            db.collection("/team")
              .where("teamName", "==", `${values.teamName}`)
              .then((res) => {
                console.log(res.data());
              })
              .catch((err) => {
                console.log(err);
              });
              */
             try {

              const docRef = await addDoc(collection(db, "team"), {
                gamePin: values.gamePin,
                password: "test",
                teamName: values.teamName
              });
              console.log("Document written with ID: ", docRef.id);
              
              
             }
             catch(err) {
              console.log(err);
             }
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
