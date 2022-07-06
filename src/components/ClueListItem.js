import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { setDoc, doc } from "firebase/firestore";
import db from "../firebase";

function ClueListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <Formik
        initialValues={{
          location: props.location,
          instructions: props.instructions,
          answer: props.answer,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.answer) {
            errors.answer = "Required";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await setDoc(doc(db, "games", props.gamePin, "clues", props.id), {
            location: values.location,
            instructions: values.instructions,
            answer: values.answer,
          });
          setIsEditing(false);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <p>
              Location: <Field name="location" />
            </p>
            <ErrorMessage name="location" component="p" />

            <p>
              Instructions: <Field name="instructions" as="textarea" />
            </p>
            <ErrorMessage name="instructions" component="p" />

            <p>
              Answer: <Field name="answer" />
            </p>
            <ErrorMessage name="answer" component="p" />

            <button type="submit" disabled={isSubmitting}>
              Update Clue
            </button>
            <hr />
          </Form>
        )}
      </Formik>
    );
  } else {
    return (
      <div>
        <p>Location: {props.location}</p>
        <p>Instructions: {props.instructions}</p>
        <p>Answer: {props.answer}</p>
        <button
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Edit
        </button>
        <hr />
      </div>
    );
  }
}

export default ClueListItem;
