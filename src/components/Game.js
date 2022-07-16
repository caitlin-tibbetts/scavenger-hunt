import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import Grid from "@material-ui/core/Grid";

import "../style/Game.css"

import db from "../firebase";
import ClueCard from "./ClueCard";

function Game(props) {
  const [teamData, setTeamData] = useState();
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const unsubscribeClues = onSnapshot(
      doc(db, "games", props.gamePin, "teams", props.teamName),
      (snapshot) => {
        alert("11");
        if (snapshot.exists()) {
          if ("clueList" in snapshot.data()) {
            setTeamData(snapshot.data());
            let iGameOver = true;
            snapshot.data().clueList.forEach((clue) => {
              if (clue.status !== 3) {
                iGameOver = false;
              }
            });
            setGameOver(iGameOver);
          } else {
            alert("45");
            getDocs(collection(db, "games", props.gamePin, "clues")).then(
              (col) => {
                alert("22");
                let iClueList = col.docs
                  .sort((a, b) => 0.5 - Math.random())
                  .map((clue, index) => {
                    if (index === 0) {
                      return {
                        id: clue.id,
                        location: clue.data().location,
                        instructions: clue.data().instructions,
                        answer: clue.data().answer,
                        link: clue.data().link || "",
                        status: 1,
                      };
                    }
                    return {
                      id: clue.id,
                      location: clue.data().location,
                      instructions: clue.data().instructions,
                      answer: clue.data().answer,
                      link: clue.data().link || "",
                      status: 0,
                    };
                  });
                  alert("55");
                setDoc(
                  doc(db, "games", props.gamePin, "teams", props.teamName),
                  { clueList: iClueList, points: 0 },
                  { merge: true }
                ).then(() => {
                  alert("13");
                  setTeamData({
                    name: props.teamName,
                    clueList: iClueList,
                    points: 0,
                  });
                  let iGameOver = true;
                  iClueList.forEach((clue) => {
                    if (clue.status !== 3) {
                      iGameOver = false;
                    }
                  });
                  setGameOver(iGameOver);
                });
              }
            );
          }
        }
      }
    );

    return () => {
      alert("46");
      unsubscribeClues();
    };
  }, [props.gamePin, props.teamName]);

  if (gameOver) {
    return (
      <p>Congratulations! You finished {props.gameName}! Head on home...</p>
    );
  }
  return (
    <>
      <div className="game-welcome">
        <h1>{props.gameName}</h1>
        <h2>Welcome {props.teamName}!</h2>
      </div>
      <Grid
        container
        direction="column-reverse"
        spacing={2}
        alignItems="center"
        style={{ maxHeight: "45vh", flexWrap: "nowrap", overflow: "auto" }}
      >
        {teamData && teamData.clueList ? (
          teamData.clueList.map((clue, i) => {
            return (
              <Grid item key={i + 1} xs={12} style={{paddingTop: "0vh"}}>
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
                  link={clue.link || ""}
                />
              </Grid>
            );
          })
        ) : (
          <Grid item xs={9}>
            <ReactLoading type="spokes" color="#4a4747" />
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default Game;
