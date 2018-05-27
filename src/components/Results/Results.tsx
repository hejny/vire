import * as React from 'react';
import * as QRCode from 'qrcode';
import { observer } from 'mobx-react';
import './Results.css';
import { print } from '../../tools/print';
import { DataModel } from '../../model/DataModel';
import { Loading } from '../Loading/Loading';

export const Results = observer((props: { dataModel: DataModel }) => {
    const correctAnswer = (answer: boolean | null) =>
        answer === true || answer === false;

    const externalUrl = `https://volebnikalkulacka.cz/cs/hackathon-2018/results/?q=${encodeURIComponent(
        props.dataModel.answersQuery,
    )}`;

    return (
        <div className="Results" id="results">
            {/*<h1>Volební kalkulačka</h1>*/}

            <button onClick={print}>Vytisknout</button>
            <button onClick={() => props.dataModel.restart()}>Znovu</button>
            <a href={externalUrl} target="_blank">
                <button>Volební kalkulačka</button>
            </a>

            {props.dataModel.answers!.some((answer) => !correctAnswer) && (
                <div className="warning">
                    Některé odpovědi({props.dataModel
                        .answers!.map(
                            (answer, answerIndex) =>
                                correctAnswer(answer)
                                    ? null
                                    : (answerIndex + 1).toString(),
                        )
                        .filter((part) => part)
                        .join(', ')}) jsme nemohli načíst nebo jste je
                    nenalepili či nalepili oboje.
                </div>
            )}

            {props.dataModel.answers!.length === 0 ? (
                <div className="warning">
                    Bohužel se nám nepovedla načíst ani jedna odpověď. Zkuste to
                    prosím znovu.
                </div>
            ) : (
                <div id="print">
                    <h1>Volební kalkulačka</h1>
                    {props.dataModel.preferencesHtml ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: props.dataModel.preferencesHtml,
                            }}
                            ref={(div) => {
                                if (!div) return;
                                div.querySelector('style')!.innerHTML = '';
                            }}
                        />
                    ) : (
                        <Loading />
                    )}
                    <div className="footer">
                        Výsledky byly vyhodnoceny pomocí{' '}
                        <b>VolebníKalkulačka.cz</b>, pokud si je chcete
                        prohlédnout detailněji zadejte:
                        <canvas
                            className={`qr`}
                            ref={(canvas) => {
                                //console.log(canvas);
                                if (!canvas) return;

                                QRCode.toCanvas(canvas, externalUrl, function(
                                    error,
                                ) {
                                    if (error) console.error(error);
                                    console.log('success!');
                                });
                            }}
                        />
                        .
                    </div>
                    {/*<img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(externalUrl)}`}/>*/}
                </div>
            )}
        </div>
    );
});
