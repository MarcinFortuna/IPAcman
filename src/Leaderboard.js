import React from 'react';
import { databaseLeaderboard } from './Firebase';

export class Leaderboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            results: [{}]
        }
    }

    async componentWillMount() {
        let results = JSON.parse(sessionStorage.getItem("results"));
        if (!results) {
            console.log("Results in session storage not found. Fetching the current leaderboard from Firebase");
            await databaseLeaderboard.once('value').then(snapshot => {
                results = snapshot.val();
            })
            sessionStorage.setItem("results", JSON.stringify(results));
            console.log("New leaderboard set in session storage");
        } else {
            console.log("Leaderboard retrieved from session storage");
        }
        console.log(results);
        let all_results = Object.values(results);
        console.log(all_results);
        let parsed_results = []
        all_results.forEach(result => {
            console.log(result);
            let parsed_result = {};
            parsed_result.name = result.username;
            parsed_result.affiliation = result.affiliation;
            switch (result.pace) {
                case 0:
                    parsed_result.pace = 'Still';
                    break;
                case 800:
                    parsed_result.pace = 'Slow';
                    break;
                case 400:
                    parsed_result.pace = 'Medium';
                    break;
                default:
                    parsed_result.pace = 'Fast';
                    break;
            }
            parsed_result.score = result.score;
            let datetime = new Date(result.timestamp).toLocaleString("pl-PL");
            parsed_result.datetime = datetime;
            parsed_results.push(parsed_result);
            parsed_results.sort((a, b) => a.score > b.score ? -1 : 1);
            this.setState({ results: parsed_results });
        })
    }

    render() {
        let leaderboard = (this.state.results).filter(x => x.score && x.name).map(parsed_result =>
            <tr key={parsed_result}>
                <td>{parsed_result.name}</td>
                <td>{parsed_result.affiliation}</td>
                <td>{parsed_result.date}</td>
                <td>{parsed_result.pace}</td>
                <td>{parsed_result.score}</td>
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
};