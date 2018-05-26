import * as React from 'react';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import './Results.css';

class Party {
    constructor(public title: string, public shortcut: string, public icon: string) {}
}

const parties:Party[] = [
    new Party(
        'Radostné Česko',
        'RČ',
        'https://volebnikalkulacka.azureedge.net/cs/volby-2017/statics/logos/38x38/rc.png',
    ),
    new Party(
        'TOP 09',
        'TOP 09',
        'https://volebnikalkulacka.azureedge.net/cs/volby-2017/statics/logos/38x38/top09.png',
    ),
    new Party(
        'Strana svobodných občanů ',
        'Svobodní',
        'https://volebnikalkulacka.azureedge.net/cs/volby-2017/statics/logos/38x38/svobodni.png',
    ),
    new Party(
        'Občanská demokratická strana ',
        'ODS',
        'https://volebnikalkulacka.azureedge.net/cs/volby-2017/statics/logos/38x38/ods.png',
    )
]


export function Results({  }: {}) {
    let results: { party: Party; percent: number }[] = [];

    for(let i=0;i<10;i++){
        results.push({
            party: parties[Math.floor(Math.random()*parties.length)],
            percent: Math.random(),
        });
    }

    results = results.sort((a,b)=>a.percent>b.percent?-1:1);
    

    return (
        <div className="Results" id="results">
            <h1>Volební kalkulačka 2017</h1>

            <button onClick={()=>{



                var quotes = document.getElementById('results');//todo better

                html2canvas(quotes!);
                


                /*var doc = new jsPDF();

                doc.setFontSize(40)
                doc.text(35, 25, 'Paranyan loves jsPDF')
                doc.addImage('http://localhost:3000/test.jpg', 'JPEG', 15, 40, 180, 160)
                doc.save('a4.pdf');*/

                alert('111');



            }}>
                Print
            </button>

            <a href="/volby.pdf" download>Download link</a>


            <ul>
                {results.map((result, resultIndex) => (
                    <li key={resultIndex}>
                        <img src={result.party.icon} />
                        <h1>{result.party.shortcut}</h1>
                        <span className="percent">{Math.round(result.percent*100)}%</span>
                        <h2>{result.party.title}</h2>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}
