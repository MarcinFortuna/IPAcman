import * as React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import {MistakesTriggerButton} from './MistakesTriggerButton';
import PaceSelector from './PaceSelector';
import {SettingsModal} from "./Settings";
import {useStore} from "./ZustandStore";

interface PanelProps {
    selectPace: (e: React.FormEvent<HTMLDivElement>) => void
}

export const Panel = (props: PanelProps) => {

    const gameOn = useStore((state) => state.gameOn);
    const toggleGameOn = useStore((state) => state.toggleGameOn);
    const currentlySearched = useStore((state) => state.currentlySearched)
    const score = useStore((state) => state.score);
    const life = useStore((state) => state.life);
    const mistakes = useStore((state) => state.mistakes);

    return (<div id="panel">
        <h2 id="logo"><img src={require("./assets/ipacman_logo.png")} alt=""/> IPAcman</h2>
        <PaceSelector selectPace={props.selectPace} gameOn={gameOn}/>
        <StartStopButton gameOn={gameOn} startGame={toggleGameOn} stopGame={toggleGameOn}/>
        <CurrentQuestion currentlySearched={currentlySearched}/>
        <Score score={score}/>
        <Lives life={life}/>
        <MistakesTriggerButton mistakes={mistakes}/>
        <SettingsModal />
    </div>);

}