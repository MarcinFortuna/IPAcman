import * as React from 'react';
import {SignInSignUpPopup} from './SignInSignUpPopup';
import {signOutOfApp} from './Firebase'
import {LeaderboardPopup} from './LeaderboardPopup';
import {ShowPrevResultsPopup} from './ShowPrevResultsPopup';
import {Box, Text} from "@chakra-ui/react";

// interface StatusBarProps {
//     user: {
//         email: string
//     }
//     userOtherData: {
//         username: string
//         displayName: string
//     }
// }

// const StatusBar = (props: StatusBarProps) => {
const StatusBar = (props: any) => {

    let greeting: string;

    if (props.user !== null && props.user.email) {
        let name: string = props.userOtherData.displayName ? props.userOtherData.displayName : (props.userOtherData.username ? props.userOtherData.username : props.user.email);
        greeting = `Hi ${name}! Welcome to IPAcman!`;
    } else {
        greeting = "Hi stranger! Welcome to IPAcman! Sign in to be able to save your results to the database and view the leaderboard!";
    }

    return (
        <Box display="flex" id="statusBar">
            <Text fontSize="sm" className="statusBarString">{greeting}</Text>
            {(props.user && props.user.email) ? <LeaderboardPopup/> : <div></div>}
            {(props.user && props.user.email) ? <ShowPrevResultsPopup userData={props.userOtherData}/> : <div></div>}
            {!(props.user && props.user.email) ? <SignInSignUpPopup/> : <div>
                <button type="button" className="button" onClick={signOutOfApp}>Log out</button>
            </div>}
        </Box>
    );
}

export default StatusBar;