import React from "react";
import { useState, useEffect } from "react";
import ClueCard from "./ClueCard";
import db from "../firebase";

import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

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

function Game(props) {
  const [clueList, setClueList] = useState([]);
  const [index, setIndex] = useState(1);
  const [finished, setFinished] = useState(false);

  const gridStyles = useGridStyles();

  useEffect(() => {
    async function getClues() {
      return (await getDocs(
        collection(db, "games", props.gamePin, "clues")
      )).docs.sort((a, b) => 0.5 - Math.random()).map((clue, index) => {
        if(index == 0) {
          return {
            id: clue.id,
            location: clue.data().location,
            instructions: clue.data().instructions,
            answer: clue.data().answer,
            status: 1
          }
        }
        return {
          id: clue.id,
          location: clue.data().location,
          instructions: clue.data().instructions,
          answer: clue.data().answer,
          status: 0
        }
      });
    }
    getClues().then((iClueList) => {
      setDoc(doc(db, "games", props.gamePin, "teams", props.teamName), {clueList: iClueList}, {merge: true}).then(() => {
        setClueList(iClueList);
      })
      
    })
  }, []);

  return (
    <>
      <h1>{props.gameName}</h1>
      <h2>Welcome {props.teamName}!</h2>
      <Grid
        container
        direction="column"
        spacing={8}
        alignItems="center"
        style={{ maxHeight: "45vh", overflow: "auto" }}
      >
        {clueList.map((clue, i) => (
          <Grid item key={i} xs={9}>
            <ClueCard
              key={clue.id}
              id={clue.id}
              gamePin={props.gamePin}
              teamName={props.teamName}
              passcode={clue.id.slice(0, 6)}
              index={i + 1}
              answer={clue.answer}
              instructions={clue.instructions}
              location={clue.location}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Game;
