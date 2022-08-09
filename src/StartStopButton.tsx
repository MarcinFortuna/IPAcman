import * as React from 'react';

const StartStopButton = props => {
    let buttonContent = props.gameOn ? "Stop Game" : "Start Game";
    return (
      <button id="startStopButton" onClick={props.gameOn ? props.stopGame : props.startGame}>
          {buttonContent}
      </button>
    );
}

export default StartStopButton;
  