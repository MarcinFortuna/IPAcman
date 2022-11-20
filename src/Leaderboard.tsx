import * as React from 'react';
// import {databaseLeaderboard} from './Firebase';
import {useEffect, useState} from "react";
import {LeaderboardItem} from "./types/types";

export const Leaderboard = () => {

    const [results, setResults] = useState<LeaderboardItem[]>([]);

    const parseResults = (data: any) => {

        let all_results = Object.values(data);
        let parsed_results: LeaderboardItem[] = [];

        all_results.forEach((result: any) => {
            let datetime: Date = new Date(Math.floor(result.timestamp / 1000) * 1000);
            let datetime_human: string = datetime.toLocaleString("en-GB");
            let datetime_human_no_seconds: string = datetime_human.substring(0, datetime_human.length - 3);
            let parsed_result: LeaderboardItem = {
                name: result.username,
                displayName: result.displayName,
                affiliation: result.affiliation,
                score: result.score,
                datetime: datetime_human_no_seconds,
                pace: result.pace === 0 ? 'Still' : result.pace === 800 ? 'Slow' : result.pace === 400 ? 'Medium' : 'Fast'
            }
            parsed_results.push(parsed_result);
            parsed_results.sort((a: LeaderboardItem, b: LeaderboardItem) => a.score > b.score ? -1 : 1);
        });

        setResults(parsed_results);

    };

    useEffect(() => {

        let resultsFromSessionStorage: string = JSON.parse(sessionStorage.getItem("results") as string);
        // if (!resultsFromSessionStorage) {
        //     console.log("Results in session storage not found. Fetching the current leaderboard from Firebase");
        //     databaseLeaderboard.orderByChild('score').limitToLast(10).once('value')
        //         .then(snapshot => snapshot.val())
        //         .then(async (res) => {
        //             await parseResults(res);
        //             sessionStorage.setItem("results", JSON.stringify(res));
        //         });
        //     console.log("New leaderboard set in session storage");
        // } else {
        //     parseResults(resultsFromSessionStorage);
        //     console.log("Leaderboard retrieved from session storage");
        // }

    }, []);


    let leaderboard = (results)
        .filter(x => x.score && x.displayName)
        .filter((x: LeaderboardItem, index: number) => index <= 9)
        .map((parsed_result: LeaderboardItem, index: number) =>
            <tr key={index}>
                <td>{parsed_result.displayName}</td>
                <td>{parsed_result.affiliation}</td>
                <td>{parsed_result.datetime}</td>
                <td>{parsed_result.pace}</td>
                <td style={{textAlign: "right"}}>{parsed_result.score}</td>
            </tr>);

    return (
        <div>
            {<table id="leaderboard" cellSpacing="0">
                <thead>
                <tr>
                    <td>Name</td>
                    <td>Affiliation</td>
                    <td>Date</td>
                    <td>Pace</td>
                    <td>Score</td>
                </tr>
                </thead>
                <tbody>{leaderboard}</tbody>
            </table>}
        </div>
    );
}
