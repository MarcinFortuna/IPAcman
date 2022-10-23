import * as React from 'react';
import Popup from "reactjs-popup";
import {useState} from "react";
import {useStore} from "./ZustandStore";
import IpaSampa from "./IpaSampa";

export const SettingsModal = () => {

    const useIpa = useStore((state: any) => state.useIpa);
    const toggleUseIpa = useStore((state: any) => state.toggleUseIpa);

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