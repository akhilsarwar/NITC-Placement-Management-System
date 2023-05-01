import React from "react";
import '../styles/textAnim.css'

export default function TextAnim(props){
    const primaryText = props.primaryText;
    const secondaryText = props.secondaryText;
    return (
        <div className="textAnimContainer">
            <div>{primaryText}</div> 
            <div> 
                <span>{secondaryText}</span>
            </div>
        </div>

    );
}