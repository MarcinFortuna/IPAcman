// @ts-nocheck
import * as React from 'react';
import {useState, useEffect} from "react";
import {database} from './Firebase';
import {getCorrectAnswers} from './Mistakes';

interface ShowPrevResultsProps {
    userData: string
}

//TODO: store processed data in session storage; not raw db output

export const ShowPrevResults = (props: ShowPrevResultsProps) => {

    const [attempts, setAttempts] = useState({});

    useEffect(() => {
        let attemptsFromSessionStorage = JSON.parse(sessionStorage.getItem("attempts") as string);
        if (!attemptsFromSessionStorage) {
            console.log("Previous attempts in session storage not found. Fetching the current list of previous attempts from Firebase");
            let dbUserUrl = database.ref('Users/' + props.userData.userDbKey + '/attempts/').orderByChild('timestamp');
            dbUserUrl.once('value', async snapshot => {
                let attemptsFromDB = snapshot.val();
                await setAttempts(attemptsFromDB);
                sessionStorage.setItem("attempts", JSON.stringify(attemptsFromDB));
                console.log("New list of previous attempts set in session storage");
            });
        } else {
            setAttempts(attemptsFromSessionStorage);
            console.log("A list of previous attempts retrieved from session storage");
        }
    }, []);

    let results = [];
    console.log(attempts);
    for (let i in attempts) {
        if (typeof attempts[i] !== "object") continue;
        let old_result = {};
        let datetime = new Date(Math.floor(attempts[i].timestamp / 1000) * 1000);
        let datetime_human = datetime.toLocaleString("en-GB");
        let datetime_human_no_seconds = datetime_human.substring(0, datetime_human.length - 3);
        old_result.datetime = datetime_human_no_seconds;
        let mistakes_with_results = [];
        if (attempts[i]["mistakes"]) mistakes_with_results = getCorrectAnswers(attempts[i]["mistakes"]);
        old_result.results = mistakes_with_results;
        old_result.score = attempts[i].score;
        results.push(old_result);
    }

    let list_items = results.map((x, idx) =>
        <tbody key={idx}>
        <tr>
            <td className="prevResultsTrHeader" colSpan="3">{x.datetime} | Score: {x.score}</td>
        </tr>
        {x.results.map((y, i) => <tr key={i}>
            <td>{y[0]}</td>
            <td>{y[1]}</td>
            <td>{y[2]}</td>
        </tr>)}
        </tbody>
    );

    return (
        <div>
            {<table id="showPrevResults" cellSpacing="0">
                <thead>
                <tr>
                    <td>Question</td>
                    <td>Your guess</td>
                    <td>Correct answers</td>
                </tr>
                </thead>
                {list_items}
            </table>}
        </div>
    );
};