import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Clue from "./Clue";
import db from "./firebase";

import { collection, getDocs } from "firebase/firestore";

import "./Game.css";

function Game() {
  const [clues, setClues] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "games", "0000", "clues");
    getDocs(colRef)
      .then((docSnap) => {
        const docData = [];
        docSnap.forEach((doc) => {
          docData.push({ ...doc.data() });
        });
        setClues(docData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="Game">
      {clues.map((clue, index) => {
        return (
          <Clue
            key={index}
            loc={clue.location}
            num={clue.number}
            task={clue.task}
            answer={clue.answer}
          />
        );
      })}
    </div>
  );
}

export default Game;
