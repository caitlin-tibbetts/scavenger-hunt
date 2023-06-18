import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { Container } from "react-bootstrap";

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
            getDocs(collection(db, "games", props.gamePin, "clues")).then(
              (col) => {
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
                setDoc(
                  doc(db, "games", props.gamePin, "teams", props.teamName),
                  { clueList: iClueList, points: 0 },
                  { merge: true }
                ).then(() => {
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
      <Container
        container
        style={{
          flexWrap: "nowrap",
        }}
        className={"container-cluecard"}
      >
        {teamData && teamData.clueList ? (
          teamData.clueList.map((clue, i) => {
            return (
              <>
                {(clue.status == 1 || clue.status == 2) &&
                  <Container item key={i + 1} xs={12}
                    style={{
                      paddingTop: "0vh",
                      paddingBottom: "2vh",
                      width: "100%"


                    }}>

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

                  </Container>
                }
              </>
            );
          })
        ) : (
          <Container item xs={9}>
            <ReactLoading type="spokes" color="#4a4747" />
          </Container>
        )
        }
      </Container >
    </>
  );
}

export default Game;