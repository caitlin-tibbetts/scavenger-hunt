import React, { useRef, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import ReactCardFlip from "react-card-flip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown, faX } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { setDoc, doc } from "firebase/firestore";
import { QrReader } from "react-qr-reader";
import "../style/ClueCard.css";

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
        className="clue clue-front"
        style={{ position: "relative" }}
      >
        {

          <Card.Title style={{ position: "absolute", top: "-30px", left: 65, color: "#ffffff" }}>{props.location}</Card.Title>
        }
        <Card.Body style={{ borderBottom: "1px solid rgba(0,0,0,.125)" }}>
          {showCamera && <div>

            <div className="overlay">

              < QrReader
                constraints={{ facingMode: 'environment' }}
                style={{ position: "fixed" }}
                containerStyle={{ height: "10vh", }}
                videoStyle={{ position: "fixed" }}
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

              />
            </div>
          </div>}

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
              console.log(values.passcode, props.passcode)
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
              <Form style={{ height: "100%" }}>
                <Stack gap={4} style={{ height: "100%" }}>
                  <div style={{ marginBottom: "20px" }}>

                    <i className="fa fa-camera fa-gradient"
                      onClick={() => setShowCamera(true)}
                    ></i>

                  </div>
                  <div style={{ marginBottom: "50px" }} className={"wrap-input100"}>
                    <Field className={"input100"} autoFocus name="passcode" placeholder=" " />
                    <span class="focus-input100" data-placeholder="passcode"></span>
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
      </Card >
    );
  } else if (props.status === 2) {
    return (
      <div>
        <ReactCardFlip isFlipped={showBack} flipDirection="vertical">
          <Card
            elevation={12}
            className="clue clue-front"
            style={{ position: "relative" }}
          >
            <div className="cardContainer">
              <div className="form">
                <h2>Clue #{props.index}</h2>
                <p >{props.location}</p>
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
            className="clue clue-back"
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
      <div>
        <ReactCardFlip isFlipped={showBack} flipDirection="vertical">
          <Card
            elevation={12}
            className="clue clue-front"
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
            className="clue clue-back"
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
