import { Typography } from "@material-ui/core";
import React from "react";

import "./Task.css";


function Task(props) {
    return (
        <div className="Game">
            <Typography>
                {props.desc}
            </Typography>
        </div>
    )

}

export default Task;