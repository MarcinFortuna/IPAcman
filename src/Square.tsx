import * as React from 'react';

export const Square = props => {
    let square_content = props.ipa ? props.ipa : "";
    return (
      <td className={props.classname}>{square_content}</td>
    )
}
