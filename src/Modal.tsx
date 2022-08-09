import * as React from 'react';
import Popup from 'reactjs-popup';
import { Mistakes } from './Mistakes';

export const Modal = (props) => {
    let old_score = props.score;
    let old_mistakes = props.mistakes;
    return (
    <Popup open={props.open} modal onClose={props.closeModal}>
        <div className="modal">
            <button onClick={props.closeModal} className="close_button">
                &times;
            </button>
            <h1>GAME OVER</h1>
            <h2>Your score: {old_score}</h2>
            <Mistakes mistakes={old_mistakes} />
        </div>
    </Popup>
)};