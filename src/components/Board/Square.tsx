import * as React from 'react';
import '../../App.css';
import {Tooltip} from "@chakra-ui/react";

interface SquareProps {
    classname: string
    ipa: string
}

export const Square = (props: SquareProps) => {

    const {classname, ipa} = props;

    const square_content: string = ipa ? ipa : "";
    return (
        <td className={classname}>
            <Tooltip label={square_content} fontSize="2xl">{square_content}</Tooltip>
        </td>
    );
}
