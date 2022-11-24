import * as React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import {MistakesTriggerButton} from './MistakesTriggerButton';
import PaceSelector from './PaceSelector';
import {SettingsModal} from "./Settings";
import {useSelector} from "react-redux";
import {RootState} from "./ReduxStore/store";

interface PanelProps {
    selectPace: (e: React.FormEvent<HTMLDivElement>) => void
    stopGame: () => void
}

export const Panel = (props: PanelProps) => {

    const {selectPace, stopGame} = props;

    const gameOn = useSelector((state :RootState) => state.ipacmanData.gameOn);
    const currentlySearched = useSelector((state: RootState) => state.ipacmanData.currentlySearched)
    const score = useSelector((state: RootState) => state.ipacmanData.score);
    const mistakes = useSelector((state: RootState) => state.ipacmanData.mistakes);
    const life = useSelector((state: RootState) => state.ipacmanData.life);

    return (<div id="panel">
        <h2 id="logo"><img src={require("./assets/ipacman_logo.png")} alt=""/> IPAcman</h2>
        <PaceSelector selectPace={selectPace} gameOn={gameOn}/>
        <StartStopButton stopGame={stopGame}/>
        <CurrentQuestion currentlySearched={currentlySearched}/>
        <Score score={score}/>
        <Lives life={life}/>
        <MistakesTriggerButton mistakes={mistakes}/>
        <SettingsModal />
    </div>);

}