import * as React from 'react';
import Popup from 'reactjs-popup';
import {Mistakes} from './Mistakes';
import {SyntheticEvent} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";

interface ModalProps {
    open: boolean
    closeModal: (e: MouseEvent | SyntheticEvent<Element, Event> | KeyboardEvent | TouchEvent | undefined) => void
}

export const Modal = (props: ModalProps) => {

    const {open, closeModal} = props;

    const score = useSelector((state: RootState) => state.ipacmanData.score);

    return (
        <Popup open={open} modal onClose={closeModal}>
            <div className="modal">
                <button onClick={closeModal} className="close_button">
                    &times;
                </button>
                <h1>GAME OVER</h1>
                <h2>Your score: {score}</h2>
                <Mistakes />
            </div>
        </Popup>
    )
};