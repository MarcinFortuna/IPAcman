import * as React from 'react';
import './App.css';

interface SquareProps {
    classname: string
    ipa: string
}

export const Square = (props: SquareProps) => {

    let square_content: string = props.ipa ? props.ipa : "";
    return (
      <td className={props.classname}>{square_content}</td>
    )
}
