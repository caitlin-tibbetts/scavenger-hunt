import React, { useRef, useState } from 'react'

import { doc, setDoc } from 'firebase/firestore'
import { Field, Form, Formik, useFormikContext } from 'formik'
import { Card } from 'react-bootstrap'
import Stack from 'react-bootstrap/Stack'
import { QrReader } from 'react-qr-reader'

import db from '../firebase'
import '../style/ClueCard.css'

function ClueCard(props) {
  const [showCamera, setShowCamera] = useState(false)
  //const [field, meta, helpers] = useField(props);
  const formikRef = useRef()

  const AutoSubmitToken = () => {
    // Grab values and submitForm from context
    const { values, submitForm } = useFormikContext()
    React.useEffect(() => {
      // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
      if (values.passcode.length === 6) {
        submitForm()
      }
    }, [values, submitForm])
    return null
  }

  if (props.status === 1) {
    return (
      <>
        <div
          style={{
            display: 'block',
            position: 'relative',
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '20px',
          }}
        >
          {props.location}
        </div>
        <div class="break"></div>
        <Card
          elevation={12}
          className="clue clue-front"
          style={{ position: 'relative', marginBottom: '10%' }}
        >
          <Card.Body>
            {showCamera && (
              <div>
                <div className="overlay">
                  <QrReader
                    constraints={{
                      facingMode: 'environment',
                    }}
                    style={{ position: 'fixed' }}
                    containerStyle={{ height: '10vh' }}
                    videoStyle={{ position: 'fixed' }}
                    onResult={(result, error) => {
                      if (!!result) {
                        formikRef.current.setFieldValue(
                          'passcode',
                          result.text,
                          false
                        )
                        setShowCamera(false)
                        formikRef.current.handleSubmit()
                      }
                      if (!!error) {
                        console.log(error)
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <Formik
              initialValues={{ passcode: '' }}
              innerRef={formikRef}
              validate={(values) => {
                const errors = {}
                if (!values.passcode) {
                  errors.passcode = 'Required'
                }
                return errors
              }}
              onSubmit={async (values, { resetForm }) => {
                console.log(values.passcode, props.passcode)
                if (values.passcode === props.passcode) {
                  for (let i = 0; i < props.teamData.clueList.length; i++) {
                    if (props.teamData.clueList[i].id === props.id) {
                      props.teamData.clueList[i].startTime = Date.now()
                      props.teamData.clueList[i].status = 2
                    }
                  }
                  setDoc(
                    doc(db, 'games', props.gamePin, 'teams', props.teamName),
                    props.teamData
                  )
                } else {
                  resetForm()
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form style={{ height: '100%' }}>
                  <Stack gap={4} style={{ height: '100%' }}>
                    <div style={{}}>
                      <i
                        className="fa fa-camera fa-gradient qr-camera-icon"
                        onClick={() => setShowCamera(true)}
                      ></i>
                    </div>
                    <div style={{}} className={'wrap-input100'}>
                      <Field
                        className={'input100'}
                        name="passcode"
                        placeholder=" "
                      />
                      <span
                        className="focus-input100"
                        data-placeholder="passcode"
                      ></span>
                      {/* <ErrorMessage name="passcode" component="p" /> */}
                    </div>
                    <div className="wrap-login100-form-btn">
                      <div className="login100-form-bgbtn"></div>
                      <button type="submit" className="login100-form-btn">
                        Submit
                      </button>
                      <AutoSubmitToken />
                    </div>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </>
    )
  } else if (props.status === 2) {
    return (
      <>
        <div
          style={{
            display: 'block',
            position: 'relative',
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '20px',
          }}
        >
          {props.location}
        </div>
        <div class="break"></div>
        <Card
          elevation={12}
          className="clue"
          style={{ position: 'relative', marginBottom: 15 }}
        >
          <Card.Body>
            <div className="cardContainer">
              <div className="form">
                <p className={'clue-instruction'}>{props.instructions}</p>
                {props.link ? <img src={props.link} alt="Clue" /> : ''}
                <Formik
                  initialValues={{ answer: '' }}
                  validate={(values) => {
                    const errors = {}
                    if (!values.answer) {
                      errors.answer = 'Required'
                    }
                    return errors
                  }}
                  onSubmit={async (values) => {
                    if (
                      values.answer.replaceAll(/\s/g, '').toLowerCase() ===
                      props.answer.replaceAll(/\s/g, '').toLowerCase()
                    ) {
                      let nextCard = false
                      for (let i = 0; i < props.teamData.clueList.length; i++) {
                        if (props.teamData.clueList[i].id === props.id) {
                          props.teamData.clueList[i].endTime = Date.now()
                          props.teamData.clueList[i].status = 3
                          props.teamData.clueList[i].correct = true
                          props.teamData.clueList[i].points =
                            300 -
                            (props.teamData.clueList[i].endTime -
                              props.teamData.clueList[i].startTime) /
                              2000
                          if (props.teamData.clueList[i].points < 0) {
                            props.teamData.clueList[i].points = 0
                          }
                          props.teamData.clueList[i].points += 500
                          props.teamData.points +=
                            props.teamData.clueList[i].points
                          props.teamData.clueList[i].teamAnswer = values.answer
                          nextCard = true
                        } else if (nextCard) {
                          props.teamData.clueList[i].status = 1
                          nextCard = false
                        }
                      }
                      setDoc(
                        doc(
                          db,
                          'games',
                          props.gamePin,
                          'teams',
                          props.teamName
                        ),
                        props.teamData
                      ).then()
                    } else {
                      let nextCard = false
                      for (let i = 0; i < props.teamData.clueList.length; i++) {
                        if (props.teamData.clueList[i].id === props.id) {
                          props.teamData.clueList[i].endTime = Date.now()
                          props.teamData.clueList[i].status = 3
                          props.teamData.clueList[i].correct = false
                          props.teamData.clueList[i].points =
                            300 -
                            (props.teamData.clueList[i].endTime -
                              props.teamData.clueList[i].startTime) /
                              2000
                          if (props.teamData.clueList[i].points < 0) {
                            props.teamData.clueList[i].points = 0
                          }
                          props.teamData.points +=
                            props.teamData.clueList[i].points
                          props.teamData.clueList[i].teamAnswer = values.answer
                          nextCard = true
                        } else if (nextCard) {
                          props.teamData.clueList[i].status = 1
                          nextCard = false
                        }
                      }
                      setDoc(
                        doc(
                          db,
                          'games',
                          props.gamePin,
                          'teams',
                          props.teamName
                        ),
                        props.teamData
                      ).then()
                    }
                  }}
                >
                  {({ isSubmitting, values }) => (
                    <Form>
                      <div
                        className={
                          'wrap-input100 ' +
                          (values.answer && 'wrap-input100-filled')
                        }
                      >
                        <Field
                          className={'input100'}
                          name="answer"
                          placeholder=" "
                        />
                        <span
                          className="focus-input100"
                          data-placeholder="answer"
                        ></span>
                      </div>
                      <div className="wrap-login100-form-btn">
                        <div className="login100-form-bgbtn"></div>
                        <button type="submit" className="login100-form-btn">
                          Submit
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default ClueCard
