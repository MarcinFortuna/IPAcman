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


export const Leaderboard = () => {

    const leaderboardQuery = query(databaseLeaderboard, orderByChild('score'), limitToLast(10));

    const [results, setResults] = useState<LeaderboardItem[]>([]);

    const parseResults = (data: any) => {

        const all_results = Object.values(data);
        const parsed_results: LeaderboardItem[] = [];

        all_results.forEach((result: any) => {
            const datetime: Date = new Date(Math.floor(result.timestamp / 1000) * 1000);
            const datetime_human: string = datetime.toLocaleString("en-GB");
            const datetime_human_no_seconds: string = datetime_human.substring(0, datetime_human.length - 3);
            const parsed_result: LeaderboardItem = {
                name: result.username,
                displayName: result.displayName,
                affiliation: result.affiliation,
                score: result.score,
                datetime: datetime_human_no_seconds,
                pace: result.pace === 0 ? 'Still' : result.pace === 800 ? 'Slow' : result.pace === 400 ? 'Medium' : 'Fast'
            }
            parsed_results.push(parsed_result);
            parsed_results.sort((a: LeaderboardItem, b: LeaderboardItem) => a.score > b.score ? -1 : 1);
        });

        setResults(parsed_results);

    };

    useEffect(() => {
        const resultsFromSessionStorage: string = JSON.parse(sessionStorage.getItem("results") as string);

        if (!resultsFromSessionStorage) {
            console.log("Results in session storage not found. Fetching the current leaderboard from Firebase");
            get(leaderboardQuery)
                .then((snapshot) => {
                    parseResults(snapshot.val());
                })
                .catch((error) => console.error(error));
        } else {
            parseResults(resultsFromSessionStorage);
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
