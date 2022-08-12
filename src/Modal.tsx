import * as React from 'react';
import Popup from 'reactjs-popup';
import {Mistakes} from './Mistakes';
import {SyntheticEvent} from "react";
import {MistakeType} from './types/types';

interface ModalProps {
    open: boolean
    score: number
    closeModal: (e: MouseEvent | SyntheticEvent<Element, Event> | KeyboardEvent | TouchEvent | undefined) => void
    mistakes: MistakeType
}

export const Modal = (props: ModalProps) => {

    let old_score: number = props.score;
    let old_mistakes: MistakeType = props.mistakes;

    return (
        <Popup open={props.open} modal onClose={props.closeModal}>
            <div className="modal">
                <button onClick={props.closeModal} className="close_button">
                    &times;
                </button>
                <h1>GAME OVER</h1>
                <h2>Your score: {old_score}</h2>
                <Mistakes mistakes={old_mistakes}/>
            </div>
        </Popup>
    )
};