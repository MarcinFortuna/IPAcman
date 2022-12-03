import * as React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {Card, Heading} from "@chakra-ui/react";


const Score = () => {

    const score = useSelector((state: RootState) => state.ipacmanData.score);

    return (
        <Card display="flex" alignItems="center" flexDirection="column" width="100%">
            Current score:
            <Heading size="md">{score}</Heading>
        </Card>
    );
}

export default Score;