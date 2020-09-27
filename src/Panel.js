import React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import IpaSampa from './IpaSampa';
import { MistakesTriggerButton } from './MistakesTriggerButton';
import PaceSelector from './PaceSelector';

export class Panel extends React.Component {

    render() {
        return (<div id="panel">
            <h2 id="logo">IPAcman</h2>
            <IpaSampa setAlphabet={this.props.setAlphabet} />
            <PaceSelector selectPace={this.props.selectPace} gameOn={this.props.gameOn}/>
            <StartStopButton gameOn={this.props.gameOn} startGame={this.props.startGame} stopGame={this.props.stopGame} />
            <CurrentQuestion currentlySearched={this.props.currentlySearched} />
            <Score score={this.props.score} />
            <Lives life={this.props.life} />
            <MistakesTriggerButton mistakes={this.props.mistakes} />
        </div>)
    }

}