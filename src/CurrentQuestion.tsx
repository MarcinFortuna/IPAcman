import * as React from 'react';
import {Question} from "./types/types";

interface CurrentQuestionProps {
    currentlySearched: Question
}

const CurrentQuestion = (props: CurrentQuestionProps) => {
    return (
        <div id="questionBox">
            Now I would like to eat...
            <div id="question">{props.currentlySearched.question}</div>
            Remember that all other<br></br>phonemes poison me!
        </div>
    );
}

export default CurrentQuestion;