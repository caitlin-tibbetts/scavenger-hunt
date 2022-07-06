import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import ReactCardFlip from "react-card-flip";
import Task from "./Task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import "../style/Game.css";

function ClueCard(props) {
  let [showBack, setShowBack] = useState(false);

  return (
    <div className="clue">
      <ReactCardFlip isFlipped={showBack} flipDirection="vertical">
        <Card
          elevation={12}
          className="clue-front"
          style={{position: "relative"}}
        >
          <h2>Clue #{props.num}</h2>
          <p>Starting Location <FontAwesomeIcon icon={faArrowRight}/> Next Location</p>
          <FontAwesomeIcon icon={faAngleDown} onClick={() => setShowBack(!showBack)} style={{position: "absolute", bottom: 0, left: 0, width:"100%", height:"25%"}}/>
        </Card>

        <Card
          elevation={12}
          className="clue-back"
          style={{position: "relative"}}
        >
          <Task instructions={props.instructions} answer={props.answer} />
          <FontAwesomeIcon icon={faAngleDown} onClick={() => setShowBack(!showBack)} style={{position: "absolute", bottom: 0, left: 0, width:"100%", height:"25%"}}/>
        </Card>
      </ReactCardFlip>
    </div>
  );
}

export default ClueCard;
