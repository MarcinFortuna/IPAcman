import * as React from 'react';

const IpaSampa = props => {
    return (
        <div id="ipaSampa" onChange={props.setAlphabet}>
            <span>Alphabet:      </span><span>IPA  </span>
            <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
            </label>
            <span>  X-Sampa</span>
        </div>
    );
}

export default IpaSampa;