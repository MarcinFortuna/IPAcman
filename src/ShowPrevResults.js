import React from 'react';
import { database } from './Firebase';
import { getCorrectAnswers } from './Mistakes';

export class ShowPrevResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            attempts: {}
        }
    }

    async componentDidMount() {
        let dbUserUrl = database.ref('Users/' + this.props.userData.userDbKey + '/attempts/').orderByChild('timestamp');
        dbUserUrl.once('value', async snapshot => {
            let attempts = snapshot.val();
            await this.setState({ attempts: attempts });
        });
    }

    render() {
        let results = [];
        for (let i in this.state.attempts) {
            console.log(this.state.attempts[i]);
            if (typeof this.state.attempts[i] !== "object") continue;
            let old_result = {};
            let datetime = new Date(Math.floor(this.state.attempts[i].timestamp / 1000) * 1000);
            let datetime_human = datetime.toLocaleString("en-GB");
            let datetime_human_no_seconds = datetime_human.substring(0, datetime_human.length - 3);
            old_result.datetime = datetime_human_no_seconds;
            let mistakes_with_results = getCorrectAnswers(this.state.attempts[i]["mistakes"]);
            old_result.results = mistakes_with_results;
            old_result.score = this.state.attempts[i].score;
            results.push(old_result);
        }
        let list_items = results.map(x =>
            <tbody key={x}>
                <tr>
                    <td className="prevResultsTrHeader" colSpan="3">{x.datetime} | Score: {x.score}</td>
                </tr>
                {x.results.map(y => <tr>
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
    }
};