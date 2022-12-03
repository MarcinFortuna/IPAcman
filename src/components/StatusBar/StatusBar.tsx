import * as React from 'react';
import {signOutOfApp} from '../../api/Firebase'
import {Box, Button, Text} from "@chakra-ui/react";
import {FormContainer} from "./FormContainer";
import {ModalInstance} from "../ModalInstance";
import {ShowPrevResults} from "./ShowPrevResults";
import {Leaderboard} from "./Leaderboard";
import {SettingsIcon} from "@chakra-ui/icons";
import {Settings} from "../Panel/Settings";

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
        greeting = "Hi stranger! Welcome to IPAcman! Sign in to save your results to the database and view the leaderboard!";
    }

    return (
        <Box display="flex" id="statusBar" sx={{
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <Text fontSize="sm" className="statusBarString">{greeting}</Text>
            <Box>
            {(props.user && props.user.email) ?
                <ModalInstance buttonText="Leaderboard" modalTitle="Leaderboard"><Leaderboard/></ModalInstance> : null}
            {(props.user && props.user.email) ?
                <ModalInstance buttonText="Show previous results" modalTitle="All my results"><ShowPrevResults
                    userData={props.userOtherData}/></ModalInstance> : null}
                <ModalInstance buttonText={<SettingsIcon/>} modalTitle="Settings"><Settings/></ModalInstance>
            {!(props.user && props.user.email) ?
                <ModalInstance buttonText="Log in" modalTitle={""} hideCloseButton={true}><FormContainer/></ModalInstance> :
                <Button variant="outline" onClick={signOutOfApp}>Log out</Button>}
            </Box>
        </Box>);
}

export default StatusBar;
