import React from "react";
import { useState, useEffect } from "react";
import ClueCard from "./ClueCard";
import db from "../firebase";

import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import "../style/App.css";
import "../style/Game.css";

import Grid from "@material-ui/core/Grid";


function Game(props) {
  const [teamData, setTeamData] = useState([]);


  useEffect(() => {
    async function getClues() {
      return (await getDocs(
        collection(db, "games", props.gamePin, "clues")
      )).docs.sort((a, b) => 0.5 - Math.random()).map((clue, index) => {
        if(index === 0) {
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
        setTeamData({name: props.teamName, clueList: iClueList});
      })
    }).catch(console.error)
  }, [props.gamePin, props.teamName]);

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
        {teamData.clueList && teamData.clueList.map((clue, i) => (
        
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
              teamData={teamData}
              setTeamData={setTeamData}
              status={clue.status}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Game;
