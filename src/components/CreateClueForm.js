import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'

function CreateClueForm(props) {
  return (
    <Formik
      initialValues={{
        location: props.initialLocation || '',
        instructions: props.initialInstructions || '',
        link: props.initialLink || '',
        answer: props.initialAnswer || '',
      }}
      validate={(values) => {
        const errors = {}
        if (!values.answer) {
          errors.answer = 'Required'
        }
        return errors
      }}
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <p>
            Location: <Field name="location" />
          </p>
          <ErrorMessage name="location" component="p" />

          <p>Instructions</p>
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
          <Container>
            <Row>
              <Col xs={6}>
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn cancel-add-clue"></div>
                  <button
                    className="cancel-add-new-card-btn"
                    onClick={() => props.cancelCreateNewCard(false)}
                    style={{
                      backgroundColor: 'inherit',
                      border: 'none',
                      color: 'white',
                    }}
                  >
                    {'Cancel'}
                  </button>
                </div>
              </Col>
              <Col xs={6}>
                <div className="wrap-login100-form-btn" style={{ width: 120 }}>
                  <div className="login100-form-bgbtn  submit-add-clue"></div>
                  <button
                    className="add-new-card-btn"
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                    }}
                  >
                    {props.submitButtonText}
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </Form>
      )}
    </Formik>
  )
}

export default CreateClueForm
