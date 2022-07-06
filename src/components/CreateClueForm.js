import { Formik, Form, Field, ErrorMessage } from "formik";

function CreateClueForm(props) {
  return (
    <Formik
      initialValues={{
        location: "",
        instructions: "",
        answer: "",
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
            Instructions: <Field name="instructions" as="textarea" />
          </p>
          <ErrorMessage name="instructions" component="p" />

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