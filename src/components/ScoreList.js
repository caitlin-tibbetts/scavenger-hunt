import React from "react";
import { useState, useEffect } from "react";
import db from "../firebase";
import ReactLoading from "react-loading";

import { collection, onSnapshot } from "firebase/firestore";

import "../style/App.css";
import "../style/Leaderboard.css";

import Grid from "@material-ui/core/Grid";
import ScoreCard from "./ScoreCard";
import "animate.css";
import { TransitionGroup } from "react-transition-group";
import { CSSTransition } from "react-transition-group";

function ScoreList(props) {
  const [teamData, setTeamData] = useState();
  const [currentPage, setCurrentPage] = React.useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      if(teamData && teamData.length > 6) {
      setCurrentPage((cur) =>{
      return(
        teamData ? (cur < Math.floor((teamData.length-1) / 6) ? cur + 1 : 0) : 0
      )}
      );
    }}, 7000);
  
    return () => {
      clearInterval(timerId);
    };
  }, [teamData]);

  useEffect(() => {
    const unsubscribeTeams = onSnapshot(
      collection(db, "games", props.gamePin, "teams"),
      (snapshot) => {
        if (snapshot.size) {
          setTeamData(
            snapshot.docs
              .map((document) => {
                return document.data();
              })
              .sort((a, b) => b.points - a.points)
          );
        }
      }
    );
    return () => {
      unsubscribeTeams();
    };
  }, [props.gamePin]);

  return (
    <>
      <div className="leaderboard-header">
        <h1>{props.gameName}</h1>
        <h2>Scoreboard</h2>
      </div>

      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        style={{ flexWrap: "nowrap", overflow: "auto", textAlign: "left" }}
      >
        {teamData ? (
          <TransitionGroup>
            {teamData.map((teamInfo, i) => {
              return (
                i >= currentPage * 6 &&
                i < (currentPage + 1) * 6 && (
                  <CSSTransition
                    key={i + 1}
                    in={true}
                    classNames={{
                      enterActive:
                        "animate__animated animate__lightSpeedInLeft",
                      exitActive:
                        "animate__animated animate__lightSpeedOutLeft",
                    }}
                    timeout={900}
                    unmountOnExit
                  >
                    <Grid
                      item
                      key={i + 1}
                      xs={12}
                      style={{ marginBottom: "2vh" }}
                    >
                      <ScoreCard
                        key={teamInfo.id}
                        teamName={teamInfo.name}
                        index={i + 1}
                        points={teamInfo.points}
                      />
                    </Grid>
                  </CSSTransition>
                )
              );
            })}
          </TransitionGroup>
        ) : (
          <Grid item xs={9}>
            <ReactLoading type="spokes" color="#4a4747" />
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default ScoreList;
