import React from 'react';
import { SignInSignUpPopup } from './SignInSignUpPopup';
import { signOut } from './Firebase.js'


function StatusBar(props) {
    let greeting;
    if (props.user !== undefined && props.user.email) {
        let name = props.user.name ? props.user.name : props.user.email;
        greeting = `Hi ${name}! Welcome to IPAcman!`;
    } else {
        greeting = "Hi stranger! Welcome to IPAcman!";
    }

    return (
        <div id="statusBar">
            <span className="statusBarString">{greeting}</span>
            {!(props.user && props.user.email) ? <SignInSignUpPopup /> : <span className="statusBarString" onClick={signOut}>Log out</span>}
        </div>
    );
}

export default StatusBar;