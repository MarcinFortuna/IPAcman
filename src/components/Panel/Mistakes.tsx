import * as React from 'react';
import {MistakeType} from "../../types/types";
import {getCorrectAnswers} from "../../helperFunctions";
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
} from '@chakra-ui/react'


export const Mistakes = () => {

    const mistakesState: MistakeType[] = useSelector((state: RootState) => state.ipacmanData.mistakes);

    const mistakes_present: boolean = mistakesState.length > 0;
    const mistakes: string[][] = getCorrectAnswers(mistakesState);

    const mistake_list_items: JSX.Element[] = mistakes.map((mistake: string[], i: number) =>
        <Tr key={i}>
            <Td>{mistake[0]}</Td>
            <Td>{mistake[1]}</Td>
            <Td>{mistake[2]}</Td>
        </Tr>
    );

    return (
        <>
            {mistakes_present ?
                <TableContainer>
                    <Table size="sm" cellSpacing="0">
                        <Thead>
                            <Tr>
                                <Th>Question</Th>
                                <Th>Your guess</Th>
                                <Th>Correct answers</Th>
                            </Tr>
                        </Thead>
                        <Tbody>{mistake_list_items}</Tbody>
                    </Table>
                </TableContainer>
                : <Text>You have not made any mistakes yet!</Text>}
        </>
    );
};