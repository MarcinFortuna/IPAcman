import React from 'react';
import { SignInSignUpPopup } from './SignInSignUpPopup';
import { signOut } from './Firebase.js'
import { LeaderboardPopup } from './LeaderboardPopup';
import { showPrevResults } from './ShowPrevResults';
import { ShowPrevResultsPopup } from './ShowPrevResultsPopup';


function StatusBar(props) {
    let greeting;
    if (props.user !== undefined && props.user.email) {
        let name = props.userOtherData.displayName ? props.userOtherData.displayName : (props.userOtherData.username ? props.userOtherData.usernname : props.user.email);
        greeting = `Hi ${name}! Welcome to IPAcman!`;
    } else {
        greeting = "Hi stranger! Welcome to IPAcman!";
    }

    return (
        <div id="statusBar">
            <span className="statusBarString">{greeting}</span>
            {(props.user && props.user.email) ? <LeaderboardPopup /> : <div></div>}
            {(props.user && props.user.email) ? <ShowPrevResultsPopup userData={props.userOtherData}/> : <div></div>}
            {!(props.user && props.user.email) ? <SignInSignUpPopup /> : <div><button type="button" className="button" onClick={signOut}>Log out</button></div>}
        </div>
    );
}

export default StatusBar;