import * as React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {paceMapping} from "../../helperFunctions";
import {Box} from "@chakra-ui/react";

const DisplaySettings = () => {

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);
    const pace = useSelector((state: RootState) => state.ipacmanData.pace);
    const symbolScope = useSelector((state: RootState) => state.ipacmanData.symbolScope);

    return(
        <Box sx={{
            padding: "2px",
            '& td': {
                minWidth: '95px'
            },
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
                        <td>{symbolScope.selected === 'rp' ? 'Cons. RP' : 'Full Alphabet'}</td>
                    </tr>
                    <tr>
                        <td>Selection:</td>
                        <td>{symbolScope.selected === 'rp'
                            ? Object.values(symbolScope.rp).filter(val => val).length + "/2"
                            : Object.values(symbolScope.fullIpa).filter(val => val).length + "/7"
                        }</td>
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