import * as React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {paceMapping} from "../../helperFunctions";
import {Box} from "@chakra-ui/react";

const DisplaySettings = () => {

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);
    const pace = useSelector((state: RootState) => state.ipacmanData.pace);

    return(
        <Box sx={{
            padding: "2px",
            '& td:first-of-type': {
                fontWeight: 'bold'
            },
            '& td:last-of-type': {
                textAlign: "right"
            }
        }}>
            <table>
                <tbody>
                    <tr>
                        <td>Alphabet:</td>
                        <td>{useIpa ? 'IPA' : 'X-Sampa'}</td>
                    </tr>
                    <tr>
                        <td>Set:</td>
                        <td>Conservative RP</td>
                    </tr>
                    <tr>
                        <td>Selection:</td>
                        <td>Full</td>
                    </tr>
                    <tr>
                        <td>Pace:</td>
                        <td>{Object.keys(paceMapping).find(key => paceMapping[key] === pace)}</td>
                    </tr>
                </tbody>
            </table>
        </Box>
    );
}

export default DisplaySettings;