import * as React from 'react';
import {phonemes} from '../../data/RP_segments';
import {MistakeType} from "../../types/types";
import {getCorrectAnswers} from "../../helperFunctions";
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";

export const Mistakes = () => {

    const mistakesState: MistakeType[] = useSelector((state: RootState) => state.ipacmanData.mistakes);

    let mistakes_present: boolean = mistakesState.length > 0;
    let mistakes: string[][] = getCorrectAnswers(mistakesState);

    let mistake_list_items: JSX.Element[] = mistakes.map((mistake: string[], i: number) =>
        <tr key={i}>
            <td>{mistake[0]}</td>
            <td>{mistake[1]}</td>
            <td>{mistake[2]}</td>
        </tr>
    );

    return (
        <div>
            <h2>Your mistakes:</h2>
            {mistakes_present ?
                <table id="mistakes_table" cellSpacing="0">
                    <thead>
                    <tr>
                        <td>Question</td>
                        <td>Your guess</td>
                        <td>Correct answers</td>
                    </tr>
                    </thead>
                    <tbody>{mistake_list_items}</tbody>
                </table>
                : <p id="no_mistakes">You have not made any mistakes yet!</p>}
        </div>
    );
};