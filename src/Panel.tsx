import * as React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import IpaSampa from './IpaSampa';
import {MistakesTriggerButton} from './MistakesTriggerButton';
import PaceSelector from './PaceSelector';
import {MistakeType, Question} from "./types/types";
import {SettingsModal} from "./Settings";

interface PanelProps {
    setAlphabet: (e: React.FormEvent<HTMLDivElement>) => void
    gameOn: boolean
    selectPace: (e: React.FormEvent<HTMLDivElement>) => void
    startGame: () => void
    stopGame: () => void
    score: number
    life: number
    mistakes: MistakeType[]
    currentlySearched: Question
}

export const Panel = (props: PanelProps) => {

    return (<div id="panel">
        <h2 id="logo"><img src={require("./assets/ipacman_logo.png")} alt=""/> IPAcman</h2>
        <IpaSampa setAlphabet={props.setAlphabet}/>
        <PaceSelector selectPace={props.selectPace} gameOn={props.gameOn}/>
        <StartStopButton gameOn={props.gameOn} startGame={props.startGame} stopGame={props.stopGame}/>
        <CurrentQuestion currentlySearched={props.currentlySearched}/>
        <Score score={props.score}/>
        <Lives life={props.life}/>
        <MistakesTriggerButton mistakes={props.mistakes}/>
        <SettingsModal />
    </div>);

}