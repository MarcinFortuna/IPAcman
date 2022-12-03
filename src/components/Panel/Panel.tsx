import * as React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import {ModalInstance} from "../ModalInstance";
import {Mistakes} from "./Mistakes";
import {SettingsIcon} from '@chakra-ui/icons';
import {Box} from "@chakra-ui/react";
import IpacmanHeading from "./IpacmanHeading";
import {Settings} from "./Settings";
import DisplaySettings from "./DisplaySettings";

interface PanelProps {
    stopGame: () => void
}

export const Panel = (props: PanelProps) => {
    const {stopGame} = props;
    return (<Box display="flex" flexDirection="column" alignItems="center" gap="1">
        <IpacmanHeading/>
        <DisplaySettings />
        <StartStopButton stopGame={stopGame}/>
        <CurrentQuestion />
        <Score />
        <Lives />
        <ModalInstance buttonText="View your mistakes" modalTitle="Mistakes"><Mistakes /></ModalInstance>
    </Box>);
}