import * as React from 'react';
import {Question} from "../../types/types";
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {Card, CardHeader, CardBody, Heading} from '@chakra-ui/react';

const CurrentQuestion = () => {
    const currentlySearched: Question = useSelector((state: RootState) => state.ipacmanData.currentlySearched)
    return (
        <Card id="questionBox" width="100%" height="119px">
            <CardHeader pb={0}>Now I would like to eat...</CardHeader>
            <CardBody sx={{
                maxWidth: "300px",
                textAlign: "center"
            }}>
                <Heading as="h4" size="xs" fontFamily="monospace" noOfLines={2}>{currentlySearched.question}</Heading>
            </CardBody>
        </Card>
    );
}

export default CurrentQuestion;