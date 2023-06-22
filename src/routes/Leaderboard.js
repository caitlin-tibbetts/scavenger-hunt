import React, { useState } from 'react'

import { doc, getDoc } from 'firebase/firestore'
import { ErrorMessage, Field, Form, Formik } from 'formik'

import ScoreList from '../components/ScoreList'
import db from '../firebase'
import '../style/App.css'
import '../style/Leaderboard.css'
import { Container, Row, Col } from 'react-bootstrap'

function Leaderboard() {
  const [gamePin, setGamePin] = useState('')
  const [gameName, setGameName] = useState('')
  const [isGamePinSet, setIsGamePinSet] = useState(false)

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
      onSubmit={async (values, { setSubmitting }) => {
        setGamePin(values.gamePin)
        setIsGamePinSet(true)
        setSubmitting(false)

        let iGameName = (await getDoc(doc(db, 'games', values.gamePin))).data()
          .name

        setGameName(iGameName)
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <p>
            <div
              style={{ color: 'white', borderBottom: '2px solid #ffffff' }}
              className={'wrap-input100'}
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
                style={{
                  '::after': {
                    marginTop: 100,
                  },
                }}
              ></span>
            </div>
          </p>

          <div className="wrap-login100-form-btn" style={{ width: 100 }}>
            <div className="login100-form-bgbtn"></div>
            <button
              className="login100-form-btn"
              type="submit"
              disabled={isSubmitting}
              style={{ fontSize: 14 }}
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )

  if (isGamePinSet) {
    return (
      <div className="App">
        <div className="Floating-form score-form">
          <ScoreList gamePin={gamePin} gameName={gameName} />
        </div>
      </div>
    )
  } else {
    return (
      <div className="App">
        <div className="Leaderboard Floating-form">{gamePinForm}</div>
      </div>
    )
  }
}

export default Leaderboard
