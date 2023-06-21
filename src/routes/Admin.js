import React, { useState } from 'react'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'

import AdminForm from '../components/AdminForm'
import db from '../firebase'
import '../style/Admin.css'
import '../style/App.css'

function Admin() {
  const [gamePin, setGamePin] = useState('')
  const [isGamePinSet, setIsGamePinSet] = useState(false)
  const [createGame, setCreateGame] = useState(false)

  const gamePinForm = (
    <Formik
      initialValues={{ gamePin: '' }}
      validate={async (values) => {
        const regex = new RegExp('[0-9]{4}$')
        const errors = {}
        if (
          values.gamePin.length > 0 &&
          (!values.gamePin || !regex.test(values.gamePin))
        ) {
          errors.gamePin = 'Game pin must be exactly four numbers'
        }
        if (
          values.gamePin.length > 0 &&
          !(await getDoc(doc(db, 'games', values.gamePin))).exists()
        ) {
          errors.gamePin = 'Game does not exist'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        setGamePin(values.gamePin)
        setIsGamePinSet(true)
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <p>
            <div
              style={{ color: 'white', borderBottom: '2px solid #ffffff' }}
              className={
                'wrap-input100 ' + (values.answer && 'wrap-input100-filled')
              }
            >
              <Field
                style={{ color: 'white' }}
                name="gamePin"
                className={'input100'}
                placeholder=" "
              />
              <span
                className="focus-input100  focus-input100-game-pin"
                data-placeholder="Game Pin"
                style={{"::after": {
                  marginTop: 100
                }}}
              ></span>
            </div>

            <Container style={{ marginTop: 15}}>
              <Row style={{margin: 0, width: "100%", marginLeft: -25 }}>
                <Col xs={6} >
                  <div
                    className="wrap-login100-form-btn"
                    style={{ width: 100}}
                  >
                    <div className="login100-form-bgbtn"></div>
                    <button
                      className="login100-form-btn"
                      type="submit"
                      disabled={isSubmitting}
                      style={{fontSize: 14}}
                    >
                      Submit
                    </button>
                  </div>
                </Col>
                <Col xs={6} >
                  <div
                    className="wrap-login100-form-btn"
                    style={{ width: 150, padding: 1 }}
                  >
                    <div className="login100-form-bgbtn"></div>
                    <button
                      className="login100-form-btn"
                      style={{fontSize: 14}}
                      onClick={() => {
                        setCreateGame(true)
                      }}  
                 
                   
                    >
                      Create new Game
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </p>
          <ErrorMessage name="gamePin" component="p" />
        </Form>
      )}
    </Formik>
  )

  if (createGame) {
    return (
      <div className="App">
        <div className="Floating-form">
          <Formik
            initialValues={{ gamePin: '', gameTitle: '' }}
            validate={async (values) => {
              const regex = new RegExp('[0-9]{4}$')
              const errors = {}
              if (!values.gamePin || !regex.test(values.gamePin)) {
                errors.gamePin = 'Game pin must be exactly four numbers'
              }
              if (!values.gameTitle) {
                errors.gameTitle = 'Required'
              }
              return errors
            }}
            onSubmit={async (values) => {
              await setDoc(doc(db, 'games', values.gamePin), {
                name: values.gameTitle,
              })
              setCreateGame(false)
              setIsGamePinSet(true)
              setGamePin(values.gamePin)
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <p>
                  Game Pin: <Field name="gamePin" />
                  <ErrorMessage name="gamePin" component="p" />
                </p>
                <p>
                  Game Title: <Field name="gameTitle" />
                  <ErrorMessage name="gameTitle" component="p" />
                </p>
                <button type="submit" disabled={isSubmitting}>
                  Create
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  } else if (isGamePinSet) {
    return (
      <div className="App">
        <div className="Floating-form" style={{width: 200, maxWidth: 250}}>
          {gamePinForm}
          <hr style={{ width: '100%', height: '100%' }} />
          <AdminForm gamePin={gamePin} />
        </div>
      </div>
    )
  } else {
    return (
      <div className="App">
        <div className="Floating-form" style={{verticalAlign: "center", height: 200, paddingTop: 40}}>{gamePinForm}</div>
      </div>
    )
  }
}

export default Admin
