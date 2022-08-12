import * as React from 'react';

interface StartStopButtonProps {
    gameOn: boolean
    startGame: () => void
    stopGame: () => void
}

const StartStopButton = (props: StartStopButtonProps) => {

    const buttonContent: string = props.gameOn ? "Stop Game" : "Start Game";

    return (
      <button id="startStopButton" onClick={props.gameOn ? props.stopGame : props.startGame}>
          {buttonContent}
      </button>
    );
}

export default StartStopButton;
  