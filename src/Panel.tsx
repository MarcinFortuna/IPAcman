import * as React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import {MistakesTriggerButton} from './MistakesTriggerButton';
import PaceSelector from './PaceSelector';
import {MistakeType, Question} from "./types/types";
import {SettingsModal} from "./Settings";
import {useStore} from "./ZustandStore";

interface PanelProps {
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

    const gameOn = useStore((state: any) => state.gameOn);
    const toggleGameOn = useStore((state: any) => state.toggleGameOn);
    const currentlySearched = useStore((state: any) => state.currentlySearched)

    return (<div id="panel">
        <h2 id="logo"><img src={require("./assets/ipacman_logo.png")} alt=""/> IPAcman</h2>
        <PaceSelector selectPace={props.selectPace} gameOn={props.gameOn}/>
        <StartStopButton gameOn={gameOn} startGame={toggleGameOn} stopGame={toggleGameOn}/>
        <CurrentQuestion currentlySearched={currentlySearched}/>
        <Score score={props.score}/>
        <Lives life={props.life}/>
        <MistakesTriggerButton mistakes={props.mistakes}/>
        <SettingsModal />
    </div>);

}