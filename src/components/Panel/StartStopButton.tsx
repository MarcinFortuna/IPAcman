import * as React from 'react';
import {AppDispatch, RootState} from "../../ReduxStore/store";
import {useSelector, useDispatch} from "react-redux";
import {toggleGameOn} from '../../ReduxStore/reducers/IpacmanReducer';
import { Button } from '@chakra-ui/react'

interface StartStopButtonProps {
    stopGame: () => void
}

const StartStopButton = (props: StartStopButtonProps) => {

    const {stopGame} = props;

    const gameOn: boolean = useSelector((state: RootState) => state.ipacmanData.gameOn);
    const dispatch: AppDispatch = useDispatch();
    const buttonContent: string = gameOn ? "Stop Game" : "Start Game";

    return (
      <Button colorScheme="yellow" id="startStopButton"
              onClick={() => gameOn ? stopGame() : dispatch(toggleGameOn())}
              sx={{
                  width: "100px"
              }}>
          {buttonContent}
      </Button>
    );
}

export default StartStopButton;
  