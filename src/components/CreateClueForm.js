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
            Location:{' '}
            <Field
              name="location"
              style={{ fontSize: 15, height: 30, width: '100%' }}
            />
          </p>
          <ErrorMessage name="location" component="p" />

          <p>Instructions</p>
          <Field
            name="instructions"
            as="textarea"
            style={{ fontSize: 15, height: 100, width: '100%' }}
          />
          <ErrorMessage name="instructions" component="p" />

          <p>
            Picture Link:{' '}
            <Field
              name="link"
              style={{ fontSize: 15, height: 30, width: '100%' }}
            />
          </p>
          <ErrorMessage name="link" component="p" />

          <p>
            Answer:{' '}
            <Field
              name="answer"
              style={{ fontSize: 15, height: 30, width: '100%' }}
            />
          </p>
          <ErrorMessage name="answer" component="p" />
          <Container style={{ marginTop: 15, width: "120%", padding: 0, marginLeft: -28 }}>
              <Row style={{ width: '100%', marginLeft: 10, marginRight: 10 }}>
              <Col xs={6} >
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn cancel-add-clue"></div>
                  <button
                    className="cancel-add-new-card-btn"
                    onClick={props.cancelCreateNewCard}
                    style={{
                      backgroundColor: 'inherit',
                      border: 'none',
                      color: 'white'
                    }}
                  >
                    {'Cancel'}
                  </button>
                </div>
              </Col>
              <Col xs={6}>
                <div className="wrap-login100-form-btn" style={{ width: 120, padding: 1 }}>
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
