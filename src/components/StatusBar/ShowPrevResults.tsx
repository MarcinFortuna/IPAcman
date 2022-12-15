import * as React from 'react';
import {useState, useEffect} from "react";
import {database} from '../../api/Firebase';
import {ref, query, orderByChild, get} from "firebase/database";
import {parseDBResultsResponse} from '../../helperFunctions';
import {ParsedMistakeType, PhoneticSymbol, PreviousResults, ResultsDBResponse, UserData} from "../../types/types";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
} from '@chakra-ui/react';
import {useGetRandomPhonemeAndAnswers} from "../../helperQuestionFunctions";
import GenerateLink from "../LinkToPhoneme";

interface ShowPrevResultsProps {
    userData: UserData
}

export const ShowPrevResults = (props: ShowPrevResultsProps) => {

    const [attempts, setAttempts] = useState<PreviousResults[]>([]);
    const {getCorrectAnswers} = useGetRandomPhonemeAndAnswers();

    useEffect(() => {
        const attemptsFromSessionStorage: PreviousResults[] = JSON.parse(sessionStorage.getItem("attempts") as string);
        if (!attemptsFromSessionStorage) {
            console.log("Previous attempts in session storage not found. Fetching the current list of previous attempts from Firebase");
            const dbUserUrl = query(ref(database, 'Users/' + props.userData.userDbKey + '/attempts/'), orderByChild('timestamp'));
            get(dbUserUrl).then(async (snapshot) => {
                const attemptsFromDB: ResultsDBResponse = await snapshot.val();
                const parsedAttempts: PreviousResults[] = parseDBResultsResponse(attemptsFromDB, "P", getCorrectAnswers) as PreviousResults[];
                setAttempts(parsedAttempts);
                sessionStorage.setItem("attempts", JSON.stringify(parsedAttempts));
                console.log("New list of previous attempts set in session storage");
            });
        } else {
            setAttempts(attemptsFromSessionStorage);
            console.log("A list of previous attempts retrieved from session storage");
        }
    }, []);

    const list_items = attempts.map((attempt: PreviousResults, idx: number) =>
        <Tbody key={idx}>
        <Tr>
            <Td className="prevResultsTrHeader" colSpan={3} sx={{fontWeight: "bold"}}>{attempt.datetime} | Score: {attempt.score} | Mode: {attempt.mode ? attempt.mode : "Cons. RP"}</Td>
        </Tr>
        {attempt.results.map((mistake: ParsedMistakeType, i: number) => <Tr key={i}>
            <Td>{mistake.guessedQuestion}</Td>
            <Td>{<GenerateLink phoneticSymbol={mistake.guessedPhoneme}/>}</Td>
            <Td>{<Box sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2
            }}>{mistake.correctAnswers.map((ph: PhoneticSymbol, j: number) => <GenerateLink phoneticSymbol={ph} key={j}/>)}</Box>}</Td>
        </Tr>)}
        </Tbody>
    );

    return (
        <TableContainer>
            {<Table size="sm" cellSpacing="0">
                <Thead>
                <Tr>
                    <Th>Question</Th>
                    <Th>Your guess</Th>
                    <Th>Correct answers</Th>
                </Tr>
                </Thead>
                {list_items}
            </Table>}
        </TableContainer>
    );
};