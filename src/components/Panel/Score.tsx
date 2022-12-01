import * as React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";


const Score = () => {

    const score = useSelector((state: RootState) => state.ipacmanData.score);

    return (
        <div id="score">
            Current score:<br></br>
            <span>{score}</span>
        </div>
    );
}

export default Score;