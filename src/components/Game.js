import React from "react";
import { useState, useEffect } from "react";
import ClueCard from "./ClueCard";
import db from "../firebase";

import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import "../style/App.css";
import "../style/Game.css";

import Grid from "@material-ui/core/Grid";
import { useCookies } from "react-cookie";

function Game(props) {
  const [cookies] = useCookies(['scav-hunt']);

  const [teamData, setTeamData] = useState();
  const [invalidated, invalidate] = useState(false);
  const [gameOver, setGameOver] = useState(false);


  useEffect(() => {
    async function getClues() {
      return (
        await getDocs(collection(db, "games", cookies.gamePin, "clues"))
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
          setDoc(
            doc(db, "games", cookies.gamePin, "teams", cookies.teamName),
            { clueList: iClueList },
            { merge: true }
          ).then(() => {
            setTeamData({ name: cookies.teamName, clueList: iClueList });
          });
        })
        .catch(console.error);
        setGameOver(false);
    } else if(invalidated) {
      getDoc(doc(db, "games", cookies.gamePin, "teams", cookies.teamName)).then((iTeamData) => {
        setGameOver(true);
        iTeamData.data().clueList.forEach((clue) => {
          if(clue.status !== 3) {
            setGameOver(false);
          }
        });
        setTeamData(iTeamData.data())
      })
      invalidate(false);
    }
  }, [cookies.gamePin, cookies.teamName, invalidated, teamData]);

  if(gameOver) {
    return (
      <p>Congratulations! You finished {cookies.gameName}! Head on home...</p>
    )
  }
  return (
    <>
      <h1>{cookies.gameName}</h1>
      <h2>Welcome {cookies.teamName}!</h2>
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
                  gamePin={cookies.gamePin}
                  teamName={cookies.teamName}
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
