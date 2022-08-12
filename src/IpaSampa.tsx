import * as React from 'react';

interface IpaSampaProps {
    setAlphabet: (e: React.FormEvent<HTMLDivElement>) => void
}

const IpaSampa = (props: IpaSampaProps) => {
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