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
    getDocs(colRef).then((docSnap) => {
        setClues(docSnap);
      })
.catch((err) => {
    console.log(err);
  })
    
  
  }, []);
  
  return (
    <div className="Game">
      {clues.forEach((clue, index) => {
        clue=clue.data();
        console.log(clue)
        return (
          <Clue id={index} num={index} loc={clue.location} desc={clue.description} />
        );
      })}
    </div>
  );
}

export default Game;
