import * as React from 'react';
import Popup from 'reactjs-popup';
import {Mistakes} from './Mistakes';
import {SyntheticEvent} from "react";
import {useStore} from "./ZustandStore";

interface ModalProps {
    open: boolean
    closeModal: (e: MouseEvent | SyntheticEvent<Element, Event> | KeyboardEvent | TouchEvent | undefined) => void
}

export const Modal = (props: ModalProps) => {

    const mistakes = useStore((state) => state.mistakes);
    const score = useStore((state) => state.score);

    return (
        <Popup open={props.open} modal onClose={props.closeModal}>
            <div className="modal">
                <button onClick={props.closeModal} className="close_button">
                    &times;
                </button>
                <h1>GAME OVER</h1>
                <h2>Your score: {score}</h2>
                <Mistakes mistakes={mistakes}/>
            </div>
        </Popup>
    )
};