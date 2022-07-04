import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../style/App.css";

function Admin() {
  const [gamePin, setGamePin] = useState("");
  const [isGamePinSet, setIsGamePinSet] = useState(false);
  return (
    <div className="App">
      <div className="Floating-form">
        <Formik
          initialValues={{ gamePin: "" }}
          validate={(values) => {
            const regex = new RegExp("[0-9]{4}$");
            const errors = {};
            if (!values.gamePin || !regex.test(values.gamePin)) {
              errors.gamePin = "Game pin must be exactly four numbers";
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
              </p>
              <ErrorMessage name="gamePin" component="p" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Admin;
