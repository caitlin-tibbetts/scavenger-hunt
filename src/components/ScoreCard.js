import React, { useState } from "react";
import Card from "@material-ui/core/Card";

import "../style/App.css";
import { Divider, Grid } from "@material-ui/core";

function ScoreCard(props) {

    return (
      <Card
        elevation={12}
        className="scorecard"
      >
        <Grid container direction="row"
         spacing={0}
        justifyContent="center"
        alignItems="center"
        style={{display: "flex", flexWrap: "nowrap", overflow: "auto", height: "inherit"}}
        >
           <Grid item xs={1} style={{marginLeft: '2vh', textAlign: 'center'}}>
        <h2 >{props.index}</h2>
        </Grid>
        <Divider orientation='vertical' flexItem style={{marginRight: '2vh', marginLeft: '2vh'}}/>
        <Grid item xs={6} style={{marginLeft: '2vh'}}>
        <h2 >{props.teamName}</h2>
        </Grid>
        <Divider orientation='vertical' flexItem style={{marginRight: '2vh', marginLeft: '2vh'}}/>
        <Grid item xs={5} >
             Points: {Math.round(props.points)}
          </Grid>
        </Grid>
    
      </Card>
    );
}

export default ScoreCard;
