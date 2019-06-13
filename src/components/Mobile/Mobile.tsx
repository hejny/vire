import * as React from 'react';
import './Mobile.css';

export const Mobile = (props: { src: string }) => {
    return (
        <div className="Mobile">
            <div className="mobile">
                <img className="screen" src={props.src} />
            </div>
        </div>
    );
};
