import { Formik, Form, Field, ErrorMessage } from "formik";

function CreateClueForm(props) {
  return (
    <Formik
      initialValues={{
        location: props.initialLocation || "",
        instructions: props.initialInstructions || "",
        link: props.initialLink || "",
        answer: props.initialAnswer || "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.answer) {
          errors.answer = "Required";
        }
        return errors;
      }}
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <p>
            Location: <Field name="location" />
          </p>
          <ErrorMessage name="location" component="p" />

          <p>
            Instructions
          </p>
          <Field name="instructions" as="textarea" />
          <ErrorMessage name="instructions" component="p" />

          <p>
            Picture Link: <Field name="link" />
          </p>
          <ErrorMessage name="link" component="p" />

          <p>
            Answer: <Field name="answer" />
          </p>
          <ErrorMessage name="answer" component="p" />

          <button type="submit" disabled={isSubmitting}>
            {props.submitButtonText}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateClueForm;
