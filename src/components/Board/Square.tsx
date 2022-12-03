import * as React from 'react';
import '../../App.css';

interface SquareProps {
    classname: string
    ipa: string
}

export const Square = (props: SquareProps) => {

    const {classname, ipa} = props;

    let square_content: string = ipa ? ipa : "";
    return (
        <td className={classname}>{square_content}</td>
    );
}
