import React, { useRef, useState } from "react";
import Card from "@material-ui/core/Card";
import ReactCardFlip from "react-card-flip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { setDoc, doc } from "firebase/firestore";
import QrReader from "react-qr-reader";

import db from "../firebase";

function ClueCard(props) {
  const [showBack, setShowBack] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  //const [field, meta, helpers] = useField(props);
  const formikRef = useRef();

  const AutoSubmitToken = () => {
    // Grab values and submitForm from context
    const { values, submitForm } = useFormikContext();
    React.useEffect(() => {
      // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
      if (values.passcode.length === 6) {
        submitForm();
      }
    }, [values, submitForm]);
    return null;
  };


  if (props.status === 1) {
    return (
      <Card
        elevation={12}
        className="clue-front"
        style={{ position: "relative", overflow: "auto" }}
      >
        <h2>Clue #{props.index}</h2>
        <p>{props.location}</p>
        <FontAwesomeIcon
          icon={faCamera}
          onClick={() => setShowCamera(true)}
        />
        {showCamera && (
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (!!result) {
                formikRef.current.setFieldValue("passcode", result.text, false);
                setShowCamera(false);
                formikRef.current.handleSubmit();
              }
              if (!!error) {
                console.log(error)
              }

            }}
            className="camera"
            style={{ width: "100%", height: "100%" }}
          />
        )}

        <Formik
          initialValues={{ passcode: "" }}
          innerRef={formikRef}
          validate={(values) => {
            const errors = {};
            if (!values.passcode) {
              errors.passcode = "Required";
            }
            return errors;
          }}
          onSubmit={async (values, { resetForm }) => {
            console.log(values.passcode)
            if (values.passcode === props.passcode) {
              for (let i = 0; i < props.teamData.clueList.length; i++) {
                if (props.teamData.clueList[i].id === props.id) {
                  props.teamData.clueList[i].startTime = Date.now();
                  props.teamData.clueList[i].status = 2;
                }
              }
              setDoc(
                doc(db, "games", props.gamePin, "teams", props.teamName),
                props.teamData
              ).then(() => {
                setShowBack(true);
              });
            } else {
              resetForm();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <p>
                Passcode (case sensitive): <Field autoFocus name="passcode" />
                <ErrorMessage name="passcode" component="p" />
              </p>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
              <AutoSubmitToken />
            </Form>

          )}
        </Formik>
      </Card>
    );
  } else if (props.status === 2) {
    return (
      <div className="clue">
        <ReactCardFlip isFlipped={showBack} flipDirection="vertical">
          <Card
            elevation={12}
            className="clue-front"
            style={{ position: "relative" }}
          >
            <div className="cardContainer">
              <div className="form">
                <h2>Clue #{props.index}</h2>
                <p>{props.location}</p>
              </div>
              <div className="flipButton">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  onClick={() => setShowBack(!showBack)}
                  size="4x"
                />
              </div>
            </div>
          </Card>

          <Card
            elevation={12}
            className="clue-back"
            style={{ position: "relative", overflow: "auto" }}
          >
            <div className="cardContainer">
              <div className="form">
                <p>{props.instructions}</p>
                {props.link ? <img src={props.link} alt="Clue" /> : ""}
                <Formik
                  initialValues={{ answer: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.answer) {
                      errors.answer = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={async (values) => {
                    if (
                      values.answer.replaceAll(/\s/g, "").toLowerCase() ===
                      props.answer.replaceAll(/\s/g, "").toLowerCase()
                    ) {
                      let nextCard = false;
                      for (let i = 0; i < props.teamData.clueList.length; i++) {
                        if (props.teamData.clueList[i].id === props.id) {
                          props.teamData.clueList[i].endTime = Date.now();
                          props.teamData.clueList[i].status = 3;
                          props.teamData.clueList[i].correct = true;
                          props.teamData.clueList[i].points =
                            300 -
                            (props.teamData.clueList[i].endTime -
                              props.teamData.clueList[i].startTime) /
                            2000;
                          if (props.teamData.clueList[i].points < 0) {
                            props.teamData.clueList[i].points = 0;
                          }
                          props.teamData.clueList[i].points += 500;
                          props.teamData.points +=
                            props.teamData.clueList[i].points;
                          props.teamData.clueList[i].teamAnswer = values.answer;
                          nextCard = true;
                        } else if (nextCard) {
                          props.teamData.clueList[i].status = 1;
                          nextCard = false;
                        }
                      }
                      setDoc(
                        doc(
                          db,
                          "games",
                          props.gamePin,
                          "teams",
                          props.teamName
                        ),
                        props.teamData
                      ).then();
                    } else {
                      let nextCard = false;
                      for (let i = 0; i < props.teamData.clueList.length; i++) {
                        if (props.teamData.clueList[i].id === props.id) {
                          props.teamData.clueList[i].endTime = Date.now();
                          props.teamData.clueList[i].status = 3;
                          props.teamData.clueList[i].correct = false;
                          props.teamData.clueList[i].points =
                            300 -
                            (props.teamData.clueList[i].endTime -
                              props.teamData.clueList[i].startTime) /
                            2000;
                          if (props.teamData.clueList[i].points < 0) {
                            props.teamData.clueList[i].points = 0;
                          }
                          props.teamData.points +=
                            props.teamData.clueList[i].points;
                          props.teamData.clueList[i].teamAnswer = values.answer;
                          nextCard = true;
                        } else if (nextCard) {
                          props.teamData.clueList[i].status = 1;
                          nextCard = false;
                        }
                      }
                      setDoc(
                        doc(
                          db,
                          "games",
                          props.gamePin,
                          "teams",
                          props.teamName
                        ),
                        props.teamData
                      ).then();
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <p>
                        Answer: <Field name="answer" />
                      </p>
                      <ErrorMessage name="answer" component="p" />
                      <button type="submit" disabled={isSubmitting}>
                        Submit
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="flipButton">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  onClick={() => setShowBack(!showBack)}
                  size="4x"
                />
              </div>
            </div>
          </Card>
        </ReactCardFlip>
      </div>
    );
  } else if (props.status === 3) {
    return (
      <div className="clue">
        <ReactCardFlip isFlipped={showBack} flipDirection="vertical">
          <Card
            elevation={12}
            className="clue-front"
            style={{ position: "relative" }}
          >
            <div className="cardContainer">
              <div className="form">
                <h2>Clue #{props.index}</h2>
                <p>{props.location}</p>
                <p>Finished!</p>
              </div>
              <div className="flipButton">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  onClick={() => setShowBack(!showBack)}
                  size="4x"
                />
              </div>
            </div>
          </Card>

          <Card
            elevation={12}
            className="clue-back"
            style={{ position: "relative", overflow: "auto" }}
          >
            <div className="cardContainer">
              <div className="form">
                <p>{props.instructions}</p>
                {props.link ? <img src={props.link} alt="Clue" /> : ""}
                <p>Finished! Answer: {props.answer}</p>
              </div>
              <div className="flipButton">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  onClick={() => setShowBack(!showBack)}
                  size="4x"
                />
              </div>
            </div>
          </Card>
        </ReactCardFlip>
      </div>
    );
  }
}

export default ClueCard;
