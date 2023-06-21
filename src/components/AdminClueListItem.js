import { useState } from 'react'

import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'

import db from '../firebase'
import '../style/ClueCard.css'
import CreateClueForm from './CreateClueForm'

function AdminClueListItem(props) {
  const [isEditing, setIsEditing] = useState(false)
  if (isEditing) {
    return (
      <>
        <CreateClueForm
          gamePin={props.gamePin}
          initialLocation={props.location}
          initialInstructions={props.instructions}
          initialAnswer={props.answer}
          initialLink={props.link}
          submitButtonText="Update Clue"
          onSubmit={async (values) => {
            await setDoc(doc(db, 'games', props.gamePin, 'clues', props.id), {
              location: values.location,
              instructions: values.instructions,
              answer: values.answer,
              link: values.link || '',
            })
            setIsEditing(false)
          }}
        />
        <hr />
      </>
    )
  } else {
    return (
      <div style={{ color: 'white' }}>
        {props.link ? <img src={props.link} alt="Clue" /> : ''}
        <p>Passcode: {props.id.slice(0, 6)}</p>
        <p>Location: {props.location}</p>
        <p>Instructions: {props.instructions}</p>
        <p>Answer: {props.answer}</p>

        <div className="wrap-login100-form-btn"     style={{margin: 0,  width: 110, 
        margin: "0 auto"}}>
          <div className="login100-form-bgbtn"   style={{margin: 0}}></div>
          <button
            className="login100-form-btn"
            style={{margin: 0, width: "100%", fontSize: 14}}
            onClick={() => {
              setIsEditing(true)
            }}
          >
            Edit
          </button>
        </div>

        <hr />
      </div>
    )
  }
}

export default AdminClueListItem
