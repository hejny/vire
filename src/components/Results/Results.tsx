import * as React from 'react';
import './Results.css';

class Party {
    constructor(public shortcut: string, public icon: string) {}
}

export function Results({  }: {}) {
    const results: { party: Party; percent: number }[] = [
        {
            party: new Party(
                'RČ',
                'https://volebnikalkulacka.azureedge.net/cs/volby-2017/statics/logos/38x38/rc.png',
            ),
            percent: 0.78,
        },
    ];

    return (
        <div>
            {results.map((result, resultIndex) => (
                <li key={resultIndex}>
                    <img src={result.party.icon} />
                    <h2>{result.party.shortcut}</h2>
                    <span />
                </li>
            ))}
        </div>
    );
}
