import * as React from 'react';
import Emoji from './Emoji';

const Lives = props => {
    let output = [];
    if (props.life) {
        for (let i = 0; i < props.life; i++) {
            output.push("🧡");
        }
        for (let j = 3; j >= 3 - props.life; j--) {
            output.push("♡");
        }
    } else {
        for (let i = 0; i < 3; i++) {
            output.push("♡");
        }
    }
    return (
        <div id="lives">
            Lives:<br></br>
            <Emoji symbol={output[0]} />
            <Emoji symbol={output[1]} />
            <Emoji symbol={output[2]} />
        </div>
    );
}

export default Lives;