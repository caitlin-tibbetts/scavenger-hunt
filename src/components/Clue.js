import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import ReactCardFlip from "react-card-flip";
import Task from "./Task";
import { CardActionArea, CardActions, IconButton, Typography } from "@material-ui/core";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import "../style/Clue.css";

function Clue(props) {

  let [showBack, setShowBack]  = useState(false);

let handleClick = (e) => {
    e.preventDefault();

    console.log(e.target) 
    setShowBack(!showBack);
    
  }
  
  return (
    <div className="clue">
    <ReactCardFlip
      isFlipped={showBack}
      flipDirection="vertical"
    >
      <CardActionArea>
  <Card elevation={12} className="clue-front" onClick={()=>setShowBack(!showBack)}>
    
        <div>
         <Typography className="front-text">
            Clue #{props.num}
          </Typography> 
        
        </div>
   
        </Card >
        </CardActionArea>
      <Card elevation={12} className="clue-back">
        <div>
          <CardMedia 
            image={
              "https://dejpknyizje2n.cloudfront.net/marketplace/products/yin-yang-two-fighting-dragons-sticker-1538772130.3390164.png"
            }
            onClick={handleClick}
          />
        </div>

        <div>
         <Task instructions={props.instructions} answer={props.answer} /> 
        
        </div>
        <div className="back-button">
        <CardActions disableSpacing>
  <IconButton onClick={()=>setShowBack(!showBack)}>
        <ArrowBackIosNewIcon/>
        </IconButton>
        </CardActions>
        </div>
      </Card>

    </ReactCardFlip>
    
    </div>
  );
}

export default Clue;
