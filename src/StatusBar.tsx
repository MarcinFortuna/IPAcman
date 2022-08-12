import * as React from 'react';
import {SignInSignUpPopup} from './SignInSignUpPopup';
import {signOut} from './Firebase'
import {LeaderboardPopup} from './LeaderboardPopup';
import {ShowPrevResultsPopup} from './ShowPrevResultsPopup';

interface StatusBarProps {
    user: {
        email: string
    }
    userOtherData: {
        username: string
        displayName: string
    }
}

const StatusBar = (props: StatusBarProps) => {

    let greeting: string;

    if (props.user !== undefined && props.user.email) {
        let name: string = props.userOtherData.displayName ? props.userOtherData.displayName : (props.userOtherData.username ? props.userOtherData.username : props.user.email);
        greeting = `Hi ${name}! Welcome to IPAcman!`;
    } else {
        greeting = "Hi stranger! Welcome to IPAcman! Sign in to be able to save your results to the database and view the leaderboard!";
    }

    return (
        <div id="statusBar">
            <span className="statusBarString">{greeting}</span>
            {(props.user && props.user.email) ? <LeaderboardPopup/> : <div></div>}
            {(props.user && props.user.email) ? <ShowPrevResultsPopup userData={props.userOtherData}/> : <div></div>}
            {!(props.user && props.user.email) ? <SignInSignUpPopup/> : <div>
                <button type="button" className="button" onClick={signOut}>Log out</button>
            </div>}
        </div>
    );
}

export default StatusBar;