import * as React from 'react';
import {useState, useEffect} from "react";
// import {database} from './Firebase';
import {getCorrectAnswers} from './Mistakes';
import {PreviousResults, UserData} from "./types/types";

interface ShowPrevResultsProps {
    userData: UserData
}

export const ShowPrevResults = (props: ShowPrevResultsProps) => {

    const [attempts, setAttempts] = useState<PreviousResults[]>([]);

    const parseAttempts = (data: any) => {
        let results: PreviousResults[] = [];
        for (let i in data) {
            if (typeof data[i] !== "object") continue;
            let datetime: Date = new Date(Math.floor(data[i].timestamp / 1000) * 1000);
            let datetime_human: string = datetime.toLocaleString("en-GB");
            let datetime_human_no_seconds: string = datetime_human.substring(0, datetime_human.length - 3);
            let mistakes_with_results: string[][] = [];
            if (data[i]["mistakes"]) mistakes_with_results = getCorrectAnswers(data[i]["mistakes"]);
            let old_result: PreviousResults = {
                datetime: datetime_human_no_seconds,
                results: mistakes_with_results,
                score: data[i].score
            }
            results.push(old_result);
        }
        return results;
    }

    useEffect(() => {
        let attemptsFromSessionStorage = JSON.parse(sessionStorage.getItem("attempts") as string);
        // if (!attemptsFromSessionStorage) {
        //     console.log("Previous attempts in session storage not found. Fetching the current list of previous attempts from Firebase");
        //     let dbUserUrl = database.ref('Users/' + props.userData.userDbKey + '/attempts/').orderByChild('timestamp');
        //     dbUserUrl.once('value', async snapshot => {
        //         let attemptsFromDB: {[key: string]: any} = await snapshot.val();
        //         let parsedAttempts: PreviousResults[] = parseAttempts(attemptsFromDB);
        //         setAttempts(parsedAttempts);
        //         sessionStorage.setItem("attempts", JSON.stringify(parsedAttempts));
        //         console.log("New list of previous attempts set in session storage");
        //     });
        // } else {
        //     setAttempts(attemptsFromSessionStorage);
        //     console.log("A list of previous attempts retrieved from session storage");
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let list_items = attempts.map((x: PreviousResults, idx: number) =>
        <tbody key={idx}>
        <tr>
            <td className="prevResultsTrHeader" colSpan={3}>{x.datetime} | Score: {x.score}</td>
        </tr>
        {x.results.map((y: string[], i: number) => <tr key={i}>
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