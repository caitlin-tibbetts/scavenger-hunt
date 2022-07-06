import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";

import "../style/Game.css";

function Task(props) {
  const [incorrect, setIncorrect] = useState();

  return (
    <div className="Task">
      <p>{props.instructions}</p>

      <Formik
        initialValues={{ answer: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.answer) {
            errors.answer = "Required";
          }
          if (values.answer !== props.answer) {
            errors.answer = "Incorrect answer. Please try again.";
          }

          return errors;
        }}
        onSubmit={async (values) => {
          if (values.answer !== props.answer) {
            setIncorrect(true);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <p>
              Answer: <Field name="answer"/>
            </p>
            <ErrorMessage name="answer" component="p" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Task;
