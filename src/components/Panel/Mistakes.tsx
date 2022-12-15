import * as React from 'react';
import {ParsedMistakeType, PhoneticSymbol} from "../../types/types";
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
    Box,
} from '@chakra-ui/react';
import GenerateLink from "../LinkToPhoneme";

export const Mistakes = () => {

    const mistakesState: ParsedMistakeType[] = useSelector((state: RootState) => state.ipacmanData.mistakes);
    const mistakes_present: boolean = mistakesState.length > 0;

    const mistake_list_items: JSX.Element[] = mistakesState.map((mistake: ParsedMistakeType, i: number) =>
        <Tr key={i}>
            <Td>{mistake.guessedQuestion}</Td>
            <Td>{<GenerateLink phoneticSymbol={mistake.guessedPhoneme}/>}</Td>
            <Td>{<Box sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2
            }}>{mistake.correctAnswers.map((ph: PhoneticSymbol, j: number) => <GenerateLink phoneticSymbol={ph} key={j}/>)}</Box>}</Td>
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