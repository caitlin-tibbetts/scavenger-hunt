import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Clue from "./Clue";
import db from "./firebase";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import "./Game.css";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    overflow: "auto",
    [breakpoints.only("xs")]: {
      "& > *:not(:first-child)": {
        paddingLeft: 0,
      },
    },
    [breakpoints.up("sm")]: {
      justifyContent: "center",
    },
  },
}));

function Game() {
  const [teamData, setTeamData] = useState([{number: 1, answer: 'beach',  instructions: "enter answer"}, {number: 2, answer: 'bedroom',  instructions: "enter answer"}
]);
  const [index, setIndex] = useState(1);
  const [finished, setFinished] = useState(false);

  const gridStyles = useGridStyles();

  /*
  useEffect(() => {
    const teamDocRef = doc(
      db,
      "games",
      "0000",
      "teams",
      "Skw17QV8ty9O6nbTkDFS"
    );
    getDoc(teamDocRef)
      .then((teamDocSnap) => {
        setIndex(teamDocSnap.data().index);
        setFinished(teamDocSnap.data().finished);
        let tempTeamData = [];
        teamDocSnap.data().clues.forEach((docSnapRef) =>
          getDoc(docSnapRef).then((clueSnap) => {
            tempTeamData.push(clueSnap.data());
          })
        );
        setTeamData(tempTeamData);
        console.log(tempTeamData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  */
  return (
    <div className="Game">
      <div className="Game-content">
      <header className="Game-header">Welcome Team {teamData.name}</header>
      <Grid
        container
        direction="column"
        spacing={6}
       alignItems="center"
        >
      
     
          {teamData.map((clue, i) =>
            (
             
          <Grid item key={i} className="grid-item-clue" xs={6}>
            
            <Clue
              key={i}
              num={clue.number}
              answer={clue.answer}
              instructions={clue.instructions}
              className="clue"
            />
                </Grid>
            ) 
            
            
            )}

      </Grid>
      </div>
    </div>
  );
}

export default Game;
