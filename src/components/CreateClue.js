import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { collection, addDoc } from "firebase/firestore"; 

import db from "../firebase";

function CreateClue(props) {
    const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);
    return (
        <Formik
          initialValues={{ instructions: "", answer: "", nextLocation: false }}
          validate={(values) => {
            const errors = {};
            if (!values.answer) {
              errors.answer = "Required";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
             
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <p>
                Instructions: <Field name="instructions" />
              </p>
              <ErrorMessage name="instructions" component="p" />

              <p>
                Answer: <Field name="answer" disabled={!isAnswerDisabled}/>
              </p>
              <ErrorMessage name="answer" component="p" />

              <p>
                <Field name="nextLocation" type="checkbox" checked={!isAnswerDisabled} onChange={(e) => {
                    setIsAnswerDisabled(!e.target.checked);
                }}/> Use the next location as the answer.
              </p>

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
    )
}

export default CreateClue;