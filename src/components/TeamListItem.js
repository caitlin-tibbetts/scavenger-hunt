function TeamListItem(props) {
  return (
    <div>
      <p>Team Name: {props.teamName}</p>
      <p>Points: {Math.round(props.points)}</p>
      <button
        onClick={() => {
          props.setCurrentTeam(props.teamName);
          props.setIsCurrentTeamSet(true);
        }}
      >
        More Information
      </button>
      <hr />
    </div>
  );
}

export default TeamListItem;
