import React from "react";
import { useNavigate } from "react-router-dom";

export default function Recruiter(){

    const navigate = useNavigate();

    return (
        <div className="safeArea">
            <center>
            <h1 className="mb-4">Recruiter</h1>
            <button type="button" className="btn btn-primary" onClick={(e)=>{navigate('/addRecruiter', {state: {}, replace: false})}}>Add Recruiter</button>
            </center>
        </div>
    );
}