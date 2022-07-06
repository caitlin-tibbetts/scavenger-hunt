import { Typography } from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";

import "../style/Task.css";

function Task(props) {
  const [incorrect, setIncorrect] = useState();

  return (
    <div className="Task">
      <Typography>{props.instructions}</Typography>

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
        onSubmit={async (values, { setSubmitting }) => {
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
            <ErrorMessage name="answer" />
            {incorrect && <div>Incorrect Answer</div>}
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
