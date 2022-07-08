import React from "react";
import { useState, useEffect } from "react";
import ClueCard from "./ClueCard";
import db from "../firebase";

import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import "../style/App.css";
import "../style/Game.css";

import Grid from "@material-ui/core/Grid";

function Game(props) {
  const [teamData, setTeamData] = useState();
  const [invalidated, invalidate] = useState(false);
  useEffect(() => {
    async function getClues() {
      return (
        await getDocs(collection(db, "games", props.gamePin, "clues"))
      ).docs
        .sort((a, b) => 0.5 - Math.random())
        .map((clue, index) => {
          if (index === 0) {
            return {
              id: clue.id,
              location: clue.data().location,
              instructions: clue.data().instructions,
              answer: clue.data().answer,
              status: 1,
            };
          }
          return {
            id: clue.id,
            location: clue.data().location,
            instructions: clue.data().instructions,
            answer: clue.data().answer,
            status: 0,
          };
        });
    }
    if (!teamData) {
      getClues()
        .then((iClueList) => {
          alert("Setting clue list for team in App");
          setDoc(
            doc(db, "games", props.gamePin, "teams", props.teamName),
            { clueList: iClueList },
            { merge: true }
          ).then(() => {
            setTeamData({ name: props.teamName, clueList: iClueList });
          });
        })
        .catch(console.error);
    } else if(invalidated) {
      alert("Reading new team data from Firestore")
      getDoc(doc(db, "games", props.gamePin, "teams", props.teamName)).then((iTeamData) => {
        setTeamData(iTeamData)
      })
      invalidate(false);
    }
  }, [props.gamePin, props.teamName]);

  return (
    <>
    {console.log("yoyo")}
      <h1>{props.gameName}</h1>
      <h2>Welcome {props.teamName}!</h2>
      <Grid
        container
        direction="column"
        spacing={8}
        alignItems="center"
        style={{ maxHeight: "45vh", overflow: "auto" }}
      >
        {teamData &&
          teamData.clueList &&
          teamData.clueList.map((clue, i) => {
            return (
              <Grid item key={i} xs={9}>
                <ClueCard
                  key={clue.id}
                  id={clue.id}
                  teamData={teamData}
                  status={clue.status}
                  gamePin={props.gamePin}
                  teamName={props.teamName}
                  passcode={clue.id.slice(0, 6)}
                  index={i + 1}
                  answer={clue.answer}
                  instructions={clue.instructions}
                  location={clue.location}
                  invalidate={invalidate}
                />
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}

export default Game;
