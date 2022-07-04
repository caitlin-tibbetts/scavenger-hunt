import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";
import Task from "./Task";

import "./Clue.css";

function Clue(props) {
    return (
        <div className="Clue">
     <Accordion className="Accordian">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`clue_${props.num}-content`}
          id={`clue_${props.num}-header`}
        >
          <Typography>Clue #{props.num} - {props.loc}</Typography>
        </AccordionSummary>
        <AccordionDetails>
         <Task task={props.task} answer={props.answer}/>
        </AccordionDetails>
      </Accordion>
        </div>
    )

}

export default Clue;