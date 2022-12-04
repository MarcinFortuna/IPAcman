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
        </Popup>
    )
};