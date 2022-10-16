import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoaderAnim from "../components/loadingAnim";

export default function ViewRecruiter(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [details, setDetails] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const location = useLocation();
    const [msg, setMsg] = useState();
    const navigate = useNavigate();
    
    console.log(location);
    const rid = location.state.id;

    const startFetch = function(){
        setLoading(true);
        setError();
    }


    useEffect(()=>{
        startFetch();
        const reqUrl = url + '/getRecruiters/' + rid;
        
        axios.get(reqUrl, {})
             .then((res) => {
                const respData = res.data;
                if(respData.sts === "failure"){
                    setError('Failed to Load')
                }
                else{
                    respData.data.jobRequirements = JSON.parse(respData.data.jobRequirements);
                    setDetails(respData.data);
                    console.log(respData.data)
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



    const handleDelete = function (){
        startFetch();
        const reqUrl = url + '/deleteRecruiter/' + rid;
        axios.delete(reqUrl)
            .then((res) => {
                const respData = res.data;
                if(respData.sts === "failure"){
                    setError('Failed to Delete')
                }
                else{
                    setMsg('Deletion Successful')
                    navigate('/recruiter', {state: {}, replace: true});
                }
            })
            .catch((err) => {
                setLoading(false);
                setError('Failed to Delete')
            })
    }


    return (

        
        <div className="safeArea text-center">

            { loading && <LoaderAnim/>}
            {
                !loading
                &&
                <>
                <h1>{details.name}</h1>
                <br/>
                <h4>Job Role</h4>
                <p>{details.jobRole}</p>
                <br/>
                <h4>CTC</h4>
                <p><b>{details.ctc}</b></p>
                <br/>
                <h4>Job Location</h4>
                <p>{details.jobLocation}</p>
                <br/>
                <h4>Job Description</h4>
                <p>{details.jobDescription}</p>

                    <br/>
                    <h4>Requirements</h4>
                        {
                            (details.jobRequirements).map((element, index) =>{
                                return(
                                    <p key={index}>{element}</p>
                                );
                                
                            })
                        }                    
                    <br/>

                <h4>Minimum Cgpa Required</h4>
                <p><b>{details.minCgpaRequired}</b></p>
                <br />

                    { 
                        role === "Placement Coordinator"
                        &&
                        <button type="button" className="btn btn-danger btn-lg" onClick={()=>{
                            handleDelete();
                        }}>Delete</button>
                    }
                    
                </>
                
            }
        
        </div>

    

    );
}