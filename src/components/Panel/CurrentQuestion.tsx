import * as React from 'react';
import {Question} from "../../types/types";
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";

const CurrentQuestion = () => {
    const currentlySearched: Question = useSelector((state: RootState) => state.ipacmanData.currentlySearched)
    return (
        <div id="questionBox">
            Now I would like to eat...
            <div id="question">{currentlySearched.question}</div>
            Remember that all other<br></br>phonemes poison me!
        </div>
    );
}

export default CurrentQuestion;