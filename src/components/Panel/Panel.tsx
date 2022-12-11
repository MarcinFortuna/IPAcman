import * as React from 'react';
import StartStopButton from './StartStopButton';
import CurrentQuestion from './CurrentQuestion';
import Score from './Score';
import Lives from './Lives';
import {ModalInstance} from "../ModalInstance";
import {Mistakes} from "./Mistakes";
import {Box, useMediaQuery} from "@chakra-ui/react";
import IpacmanHeading from "./IpacmanHeading";
import DisplaySettings from "./DisplaySettings";
import {InfoIcon} from "@chakra-ui/icons";
import Info from "./Info";

interface PanelProps {
    stopGame: () => void
}

export const Panel = (props: PanelProps) => {

    const [isLargerThan1040] = useMediaQuery('(min-width: 1040px)');

    const {stopGame} = props;
    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap="1" width="235px" p={2}
            sx={{
                '& *': {
                    fontSize: isLargerThan1040 ? 'md' : 'xs'
                },
                '& h4': {
                    fontSize: isLargerThan1040 ? 'sm' : 'xs'
                }
            }}
        >
            <IpacmanHeading/>
            <DisplaySettings />
            <StartStopButton stopGame={stopGame}/>
            <CurrentQuestion />
            <Score />
            <Lives />
            <ModalInstance buttonText="View your mistakes" modalTitle="Mistakes"><Mistakes /></ModalInstance>
            <ModalInstance buttonText={<InfoIcon/>} modalTitle="About"><Info/></ModalInstance>
        </Box>
    );
}