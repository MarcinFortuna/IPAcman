import * as React from 'react';
import {RootState} from "./ReduxStore/store";
import {useSelector, useDispatch} from "react-redux";
import {toggleGameOn} from './ReduxStore/reducers/IpacmanReducer';

const StartStopButton = (props) => {

    const {stopGame} = props;

    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);
    const dispatch = useDispatch();
    const buttonContent: string = gameOn ? "Stop Game" : "Start Game";

    return (
      <button id="startStopButton" onClick={() => gameOn ? stopGame() : dispatch(toggleGameOn())}>
          {buttonContent}
      </button>
    );
}

export default StartStopButton;
  