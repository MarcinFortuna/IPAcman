import * as React from 'react';
import {RootState} from "./ReduxStore/store";
import {useSelector, useDispatch} from "react-redux";
import {toggleGameOn} from './ReduxStore/reducers/IpacmanReducer';

// interface StartStopButtonProps {
//     gameOn: boolean
//     startGame: () => void
//     stopGame: () => void
// }

const StartStopButton = () => {

    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);
    const dispatch = useDispatch();

    const buttonContent: string = gameOn ? "Stop Game" : "Start Game";

    return (
      <button id="startStopButton" onClick={() => dispatch(toggleGameOn())}>
          {buttonContent}
      </button>
    );
}

export default StartStopButton;
  