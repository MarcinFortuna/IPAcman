import * as React from 'react';
import {databaseLeaderboard} from '../../api/Firebase';
import {useEffect, useState} from "react";
import {LeaderboardItem} from "../../types/types";
import {query, orderByChild, limitToLast, get} from 'firebase/database';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import {parseDBResultsResponse} from "../../helperFunctions";
import {useGetRandomPhonemeAndAnswers} from "../../helperQuestionFunctions";


export const Leaderboard = () => {

    const leaderboardQuery = query(databaseLeaderboard, orderByChild('score'), limitToLast(10));

    const {getCorrectAnswers} = useGetRandomPhonemeAndAnswers();

    const [results, setResults] = useState<LeaderboardItem[]>([]);

    useEffect( () => {
        const resultsFromSessionStorage = JSON.parse(sessionStorage.getItem("results") as string);
        if (!resultsFromSessionStorage) {
            console.log("Results in session storage not found. Fetching the current leaderboard from Firebase");
            get(leaderboardQuery)
                .then(async (snapshot) => {
                    const dataFromDB = await snapshot.val();
                    const parsed_results: LeaderboardItem[] = parseDBResultsResponse(dataFromDB, "L", getCorrectAnswers) as LeaderboardItem[];
                    setResults(parsed_results);
                    sessionStorage.setItem("results", JSON.stringify(parsed_results));
                })
                .catch((error) => console.error(error));
        } else {
            setResults(resultsFromSessionStorage);
            console.log("Leaderboard retrieved from session storage");
        }
    }, []);

    const leaderboard = (results)
        .filter(x => x.score && x.displayName)
        .map((parsed_result: LeaderboardItem, index: number) =>
            <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{parsed_result.displayName}</Td>
                <Td>{parsed_result.affiliation}</Td>
                <Td>{parsed_result.datetime}</Td>
                <Td>{parsed_result.pace}</Td>
                <Td style={{textAlign: "right"}}>{parsed_result.score}</Td>
            </Tr>);

    return (
        <TableContainer>
            {<Table cellSpacing="0" size="sm">
                <Thead>
                    <Tr>
                        <Th>No.</Th>
                        <Th>Name</Th>
                        <Th>Affiliation</Th>
                        <Th>Date</Th>
                        <Th>Pace</Th>
                        <Th isNumeric>Score</Th>
                    </Tr>
                </Thead>
                <Tbody>{leaderboard}</Tbody>
            </Table>}
        </TableContainer>
    );
}
