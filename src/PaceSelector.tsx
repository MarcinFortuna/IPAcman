import * as React from 'react';

interface PaceSelectorProps {
    gameOn: boolean
    selectPace: (e: React.FormEvent<HTMLDivElement>) => void
}

const PaceSelector = (props: PaceSelectorProps) => {

    return (
        <div id="paceSelector" onChange={props.selectPace} className={props.gameOn ? 'inactive': 'active'}>
            <span>Pace:  </span><br></br>
            <label><input type="radio" value="0" name="pace" defaultChecked disabled={props.gameOn}/> <span>Still </span></label>
            <label><input type="radio" value="800" name="pace" disabled={props.gameOn}/> <span>Slow </span></label>
            <label><input type="radio" value="400" name="pace" disabled={props.gameOn}/> <span>Medium </span></label>
            <label><input type="radio" value="200" name="pace" disabled={props.gameOn}/> <span>Fast </span></label>
        </div>
    );
}

export default PaceSelector;