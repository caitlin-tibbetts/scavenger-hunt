import React from "react";
import { useState, useEffect } from "react";
import ClueCard from "../components/ClueCard";
import db from "../firebase";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import "../style/App.css";
import "../style/Game.css";

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
  const [teamData, setTeamData] = useState([
    { number: 1, answer: "beach", instructions: "enter answer" },
    { number: 2, answer: "bedroom", instructions: "enter answer" },
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
    <div className="App">
      <div className="Floating-form">
        <h1>Welcome Team {teamData.name}</h1>
        <Grid container direction="row" spacing={6} alignItems="center">
          {teamData.map((clue, i) => (
            <Grid item key={i} xs={6}>
              <ClueCard
                key={i}
                num={clue.number}
                answer={clue.answer}
                instructions={clue.instructions}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default Game;
