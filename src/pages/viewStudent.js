import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoaderAnim from "../components/loadingAnim";
import { getDateString } from "../utilFunc";

export default function ViewStudent(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [details, setDetails] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const location = useLocation();
    const [msg, setMsg] = useState();
    const navigate = useNavigate();
    
    console.log(location);
    const sid = location.state.id;

    const startFetch = function(){
        setLoading(true);
        setError();
    }


    useEffect(()=>{
        startFetch();
        const reqUrl = url + '/getStudents/' + sid;
        
        axios.get(reqUrl, {})
             .then((res) => {
                const respData = res.data;
                if(respData.sts === "failure"){
                    setError('Failed to Load')
                }
                else{
                    setDetails(respData.data);
                }
                setLoading(false);
             })
             .catch((err) => {
                console.log(err);
                setLoading(false);
                setError('Failed to Load')
                console.log(err);
             })
    }, []);



    return (

        
        <div className="safeArea text-center">

            { loading && <LoaderAnim/>}
            {
                !loading
                &&
                <>
                <h1>{details.name}</h1>
                <br/>
                <h4>Roll No</h4>
                <p>{details.rollNo}</p>
                <br/>
                <h4>Email</h4>
                <p><b>{details.email}</b></p>
                <br/>
                <h4>Address</h4>
                <p>{details.address}</p>
                <br/>
                <h4>Stream</h4>
                <p>{details.stream}</p>
                <br/>
                <h4>Branch</h4>
                <p>{details.branch}</p>
                <br/>
                <h4>CGPA</h4>
                <p>{details.cgpa}</p>
                <br/>
                <h4>Contact</h4>
                <p>{details.contact}</p>
                <br/>
                <h4>Date of Birth</h4>
                <p>{getDateString(details.dob, 1)}</p>
                <br />
                <button type="button" className="btn btn-secondary btn-lg">Download Resume</button>
                </>
                
            }
        
        </div>

    

    );
}