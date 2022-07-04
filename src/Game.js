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
  const clueArray = Object.keys(clues)
  return (
    <div className="Game">
      {
      
       clueArray.map((clue, index) => {
        console.log(clue)
        return (
          <Clue id={index} num={index} loc={clue.location} desc={clue.description} />
        );
      })}
    </div>
  );
}

export default Game;
