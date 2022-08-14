import * as React from 'react';
import {useState} from 'react';
import Popup from 'reactjs-popup';
import {ShowPrevResults} from './ShowPrevResults';
import {UserData} from "./types/types";

interface ShowPrevResultsPopupProps {
    userData: UserData
}

export const ShowPrevResultsPopup = (props: ShowPrevResultsPopupProps) => {

    const [open, setOpen] = useState<boolean>(false);
    const closeModal = () => setOpen(false);
    
    return (<div className="showPrevResultsButton">
        <button type="button" className="button" onClick={() => setOpen(o => !o)}>
            Show my previous results
        </button>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <div className="modal prevResults">
                <button onClick={closeModal} className="close_button">
                    &times;
                </button>
                <h1>All my results</h1>
                <ShowPrevResults userData={props.userData}/>
            </div>
        </Popup>
    </div>)
}
  