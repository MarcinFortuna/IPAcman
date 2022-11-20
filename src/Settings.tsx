import * as React from 'react';
import Popup from "reactjs-popup";
import {useState} from "react";
import IpaSampa from "./IpaSampa";
import {useSelector} from "react-redux";
import {RootState} from "./ReduxStore/store";
import {toggleUseIpa} from './ReduxStore/reducers/IpacmanReducer';

export const SettingsModal = () => {

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);

    const [open, setOpen] = useState<boolean>(false);
    const closeModal = () => {setOpen(false)};

    return <>
        <button type="button" className="button" onClick={() => setOpen(o => !o)}>
            Settings
        </button>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <div className="modal">
                <button onClick={closeModal} className="close_button">
                    &times;
                </button>
                <IpaSampa setAlphabet={toggleUseIpa}></IpaSampa>
            </div>
        </Popup>

    </>
}