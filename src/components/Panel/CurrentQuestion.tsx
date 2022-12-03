import * as React from 'react';
import {Question} from "../../types/types";
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {Card, CardHeader, CardBody, Heading} from '@chakra-ui/react';

const CurrentQuestion = () => {
    const currentlySearched: Question = useSelector((state: RootState) => state.ipacmanData.currentlySearched)
    return (
        <Card id="questionBox">
            <CardHeader>Now I would like to eat...</CardHeader>
            <CardBody>
                <Heading size="xs" fontSize="monospace">{currentlySearched.question}</Heading>
            </CardBody>
        </Card>
    );
}

export default CurrentQuestion;