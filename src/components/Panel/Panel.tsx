import * as React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import PaceSelector from './PaceSelector';
import {ModalInstance} from "../ModalInstance";
import IpaSampa from "./IpaSampa";
import {Mistakes} from "./Mistakes";

interface PanelProps {
    stopGame: () => void
}

export const Panel = (props: PanelProps) => {
    const {stopGame} = props;
    return (<div id="panel">
        <h2 id="logo"><img src={require("../../assets/ipacman_logo.png")} alt=""/> IPAcman</h2>
        <PaceSelector />
        <StartStopButton stopGame={stopGame}/>
        <CurrentQuestion />
        <Score />
        <Lives />
        <ModalInstance buttonText="View your mistakes" modalTitle="Mistakes"><Mistakes /></ModalInstance>
        <ModalInstance buttonText="Settings" modalTitle="Settings"><IpaSampa setAlphabet={()=>{}}/></ModalInstance>
    </div>);
}