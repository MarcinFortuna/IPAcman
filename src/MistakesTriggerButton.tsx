import * as React from 'react';
import {useState} from 'react';
import {Mistakes} from './Mistakes';
import Popup from 'reactjs-popup';
import {MistakeType} from "./types/types";

interface MistakesTriggerButtonProps {
    mistakes: MistakeType[]
}

export const MistakesTriggerButton = (props: MistakesTriggerButtonProps) => {

    const [open, setOpen] = useState<boolean>(false);
    const closeModal = () => setOpen(false);

    return (<div>
        <button type="button" className="button" onClick={() => setOpen(o => !o)}>
            View your mistakes
        </button>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <div className="modal">
                <button onClick={closeModal} className="close_button">
                    &times;
                </button>
                <Mistakes mistakes={props.mistakes}/>
            </div>
        </Popup>
    </div>)
}