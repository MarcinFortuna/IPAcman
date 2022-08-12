import * as React from 'react';

interface ScoreProps {
    score: number
}

const Score = (props: ScoreProps) => {
    return (
        <div id="score">
            Current score:<br></br>
            <span>{props.score}</span>
        </div>
    );
}

export default Score;