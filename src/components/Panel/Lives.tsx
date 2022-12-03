import * as React from 'react';
import Emoji from './Emoji';
import {useSelector} from "react-redux";
import {RootState} from "../../ReduxStore/store";
import {Box, Card} from "@chakra-ui/react";

const Lives = () => {
    const life = useSelector((state: RootState) => state.ipacmanData.life);

    let output: string[] = [];
    if (life) {
        for (let i = 0; i < life; i++) {
            output.push("🧡");
        }
        for (let j = 3; j >= 3 - life; j--) {
            output.push("♡");
        }
    } else {
        for (let i = 0; i < 3; i++) {
            output.push("♡");
        }
    }

    return (
        <Card display="flex" flexDirection="column" alignItems="center" width="100%">
            Lives:<br></br>
            <Box>
                <Emoji symbol={output[0]} />
                <Emoji symbol={output[1]} />
                <Emoji symbol={output[2]} />
            </Box>
        </Card>
    );
}

export default Lives;