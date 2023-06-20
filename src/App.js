import React, { useState } from 'react'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Field, Form, Formik } from 'formik'
import store from 'store2'

import Game from './components/Game'
import db from './firebase'
import './style/App.css'

function App() {
  const [gamePin, setGamePin] = useState(
    store.session.has('gamepin') ? store.session.get('gamepin') : ''
  )
  const [gameName, setGameName] = useState(
    store.session.has('gamename') ? store.session.get('gamename') : ''
  )
  const [teamName, setTeamName] = useState(
    store.session.has('teamname') ? store.session.get('teamname') : ''
  )

  const [isGameMode, setIsGameMode] = useState(gamePin !== '')

  if (isGameMode) {
    return (
      <div className="App">
        <div className="Floating-form game-form">
          <Game gamePin={gamePin} gameName={gameName} teamName={teamName} />
        </div>
      </div>
    )
  }
  return (
    <div className="App">
      <div className="Floating-form">
        <h1 className={'game-welcome-text'}>Welcome to the Scavenger Hunt!</h1>
        <Formik
          initialValues={{ teamName: '', gamePin: '' }}
          validate={async (values) => {
            const regex = new RegExp('[0-9]{4}$')
            const errors = {}
            if (!values.teamName) {
              errors.teamName = 'Required'
            }
            if (!values.gamePin || !regex.test(values.gamePin)) {
              errors.gamePin = 'Game pin must be exactly four numbers'
            }
            return errors
          }}
          onSubmit={async (values, { resetForm }) => {
            if (!(await getDoc(doc(db, 'games', values.gamePin))).exists()) {
              resetForm()
            } else {
              if (
                !(
                  await getDoc(
                    doc(db, 'games', values.gamePin, 'teams', values.teamName)
                  )
                ).exists()
              ) {
                await setDoc(
                  doc(db, 'games', values.gamePin, 'teams', values.teamName),
                  { name: values.teamName }
                )
              }
              let iGameName = (
                await getDoc(doc(db, 'games', values.gamePin))
              ).data().name

              store.session({
                gamepin: values.gamePin,
                gamename: iGameName,
                teamname: values.teamName,
              })
              setGamePin(values.gamePin)
              setGameName(iGameName)
              setTeamName(values.teamName)
              setIsGameMode(true)
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <Form style={{ marginBottom: '20px' }}>
              <div
                className={'wrap-input100'}
                style={{ borderBottom: '2px solid #ffffff' }}
              >
                <Field
                  className={'input100'}
                  name="teamName"
                  placeholder=" "
                  style={{ color: '#ffffff' }}
                />
                <span
                  className="focus-input100 focus-input100-home-page"
                  data-placeholder="Team Name"
                ></span>
              </div>
              {/* <ErrorMessage style={{ color: "red" }} name="teamName" component="p" /> */}

              <div
                className={'wrap-input100'}
                style={{ borderBottom: '2px solid #ffffff' }}
              >
                <Field
                  className={'input100'}
                  name="gamePin"
                  placeholder=" "
                  style={{ color: '#ffffff' }}
                />
                <span
                  className="focus-input100 focus-input100-home-page"
                  data-placeholder="Game Pin"
                ></span>
              </div>
              {/* <ErrorMessage name="gamePin" component="p" /> */}

              {/* <div className={"wrap-input100"}>
                        <Field className={"input100"} name="answer" placeholder=" " />
                        <span className="focus-input100" data-placeholder="answer"></span>
                      </div>
                      <div className="wrap-login100-form-btn">
                        <div className="login100-form-bgbtn"></div>
                        <button type="submit" className="login100-form-btn">
                          Submit
                        </button>
                      </div> */}

              <div className="wrap-login100-form-btn" style={{ width: '50%' }}>
                <div className="login100-form-bgbtn"></div>
                <button type="submit" className="login100-form-btn">
                  Join Now
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default App
