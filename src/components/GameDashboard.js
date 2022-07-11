import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";

import TeamListItem from "./TeamListItem";
import DashboardClueListItem from "./DashboardClueListItem";
import db from "../firebase";

function GameDashboard(props) {
  const [teamData, setTeamData] = useState();
  const [teamList, setTeamList] = useState([]);
  const [totalTeamPoints, setTotalTeamPoints] = useState(0);
  const [isCurrentTeamSet, setIsCurrentTeamSet] = useState(false);
  const [currentTeam, setCurrentTeam] = useState("");

  useEffect(() => {
    const unsubscribeTeams = onSnapshot(
      collection(db, "games", props.gamePin, "teams"),
      (snapshot) => {
        if (snapshot.size) {
          setTeamList(snapshot.docs.map((document) => {
            return document.data()
          }))
        }
      }
    );
    if (isCurrentTeamSet) {
        console.log("here")
      const unsubscribeClues = onSnapshot(
        doc(db, "games", props.gamePin, "teams", currentTeam),
        (snapshot) => {
          if (snapshot.exists()) {
            setTeamData(snapshot.data())
            setTotalTeamPoints(snapshot.data().points)
          }
        }
      );
      return () => {
        unsubscribeTeams();
        unsubscribeClues();
      };
    }
    return () => {
      unsubscribeTeams();
    };
  }, [currentTeam, isCurrentTeamSet, props.gamePin]);

  if (isCurrentTeamSet) {
    return (
      <div className="container">
        <div className="teams">
          {teamList &&
            teamList.map((value, index) => {
              return (
                <TeamListItem
                  key={value.name}
                  setCurrentTeam={setCurrentTeam}
                  teamName={value.name}
                  points={value.points}
                  setIsCurrentTeamSet={setIsCurrentTeamSet}
                />
              );
            })}
        </div>
        <div className="clues">
          Total Points: {Math.round(totalTeamPoints)}
          {teamData &&
            teamData.clueList.map((value, i) => {
              return (
                <DashboardClueListItem
                  key={value.id}
                  id={value.id}
                  teamName={teamData.name}
                  gamePin={props.gamePin}
                  teamData={teamData}
                  status={value.status}
                  passcode={value.id.slice(0, 6)}
                  index={i + 1}
                  answer={value.answer}
                  teamAnswer={value.teamAnswer}
                  correct={"correct" in value ? value.correct : "N/A"}
                  points={value.points}
                  instructions={value.instructions}
                  location={value.location}
                />
              );
            })}
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="teams">
        {teamList &&
          teamList.map((value, index) => {
            return (
              <TeamListItem
                key={value.name}
                setCurrentTeam={setCurrentTeam}
                teamName={value.name}
                points={value.points}
                setIsCurrentTeamSet={setIsCurrentTeamSet}
              />
            );
          })}
      </div>
      <div className="clues">
        <p>Pick a team!</p>
      </div>
    </div>
  );
}

export default GameDashboard;
