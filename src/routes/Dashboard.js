import React, { useState } from 'react'

import { doc, getDoc } from 'firebase/firestore'
import { ErrorMessage, Field, Form, Formik } from 'formik'

import DashboardForm from '../components/DashboardForm'
import db from '../firebase'
import '../style/App.css'
import '../style/Dashboard.css'

function Dashboard() {
  const [gamePin, setGamePin] = useState('')
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
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <p>
            Game Pin: <Field name="gamePin" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </p>
          <ErrorMessage name="gamePin" component="p" />
        </Form>
      )}
    </Formik>
  )

  if (isGamePinSet) {
    return (
      <div className="App">
        <div className="Floating-form">
          {gamePinForm}
          <DashboardForm gamePin={gamePin} />
        </div>
      </div>
    )
  } else {
    return (
      <div className="App">
        <div className="Floating-form">{gamePinForm}</div>
      </div>
    )
  }
}

export default Dashboard
