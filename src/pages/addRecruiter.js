import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'

export default function AddRecruiter(){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [msg, setMsg] = useState();    

    const [jobReqArray, setjobReqArray] = useState([]);
    const [currentjobReq, setCurrentJobReq] = useState(0);

    const name = useRef();
    const jobRole = useRef();
    const jobLocation = useRef();
    const jobDescription = useRef();
    const minCgpaRequired = useRef();
    const jobRequirements = useRef();
    const ctc = useRef();


    const getRequirement = function (e, to){
        jobRequirements.current.value = jobReqArray[currentjobReq + to - 1];
        setCurrentJobReq(currentjobReq + to);
    }

    

    const startFetch = function(){
        setLoading(true);
        setError();
        setMsg();
    }

    const handleSubmit = function (event){    
        event.preventDefault();
        const url = process.env.REACT_APP_BACKEND_URL +  '/addRecruiter';
        startFetch();
        axios.post(url, {
            name: name.current.value,
            jobRole: jobRole.current.value,
            jobLocation: jobLocation.current.value,
            jobDescription: jobDescription.current.value,
            jobRequirements: JSON.stringify(jobReqArray),
            minCgpaRequired: minCgpaRequired.current.value,
            ctc: ctc.current.value
        }).then((result) => {
            const respData = result.data;
            if(respData.sts === "failure"){
                setError('Server side Issue. Update Failed')
            }
            else{
                setMsg('Recruiter Added')
            }
            setLoading(false);
            
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            setError('Insertion Failed. Try again');
        })
    }


    const addJobReq = function (e) {
        var newArray = jobReqArray;
        newArray.push("");
        setjobReqArray(newArray);
        setCurrentJobReq(newArray.length);
        jobRequirements.current.value = "";
        // console.log(jobReqArray)
    }

    const updateJobReq = function (e) {
        var arr = [...jobReqArray];
        arr[currentjobReq - 1] = jobRequirements.current.value;
        setjobReqArray(arr);
        // console.log(arr);
    }

    const deleteJobReq = function (e){
        var arr = [...jobReqArray];
        arr.splice(currentjobReq - 1, 1);
        setjobReqArray(arr);
        // console.log(arr);
        if(arr.length){
            jobRequirements.current.value = arr[0];
            setCurrentJobReq(1);    
        }
        else{
            jobRequirements.current.value = "";
            setCurrentJobReq(0);
        }
        
    }
    

    return (
        
        <div className="safeArea">
            <h1 className="mb-4">Add Recruiter</h1>
            <form onSubmit= {(e)=>{handleSubmit(e)}}>
                <div className="mb-3">
                    <label htmlFor="companyName" className="form-label">Name</label>
                    <input type="text" className="form-control" id="companyName" aria-describedby="nameHelp" ref={name} required/>
                    <div id="nameHelp" className="form-text">Enter the name of the company</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="jobRole" className="form-label">Job Role</label>
                    <input type="text" className="form-control" id="jobRole" ref={jobRole} required/>
                </div>  
                <div className="mb-3">
                    <label htmlFor="jobDesc">Job Description</label>
                    <textarea className="form-control rounded-0" id="jobDesc" rows="10" ref={jobDescription} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="companyCtc">CTC</label>
                        <input type="number" className="form-control" id="companyCtc" ref={ctc} required/>
                        </div>
                
                <div className="mb-3">
                    <label htmlFor="jobLoc" className="form-label">Job Location</label>
                    <input type="text" className="form-control" id="jobLoc" ref={jobLocation} required/>
                    </div>  

                    <div className="mb-3">
                        
                        <label className="form-label" htmlFor={`jobReqArea`}>Job Requirements</label>
                        <textarea className="form-control rounded-0" rows="10" id={`jobReqArea`}
                        disabled={!jobReqArray.length} ref={jobRequirements} onChange={(e)=>{
                            updateJobReq(e)
                        }}></textarea>
                        
                        <br />
                        
                        <button type="button" className="iconButton" role="button" disabled={
                            currentjobReq === 1 || jobReqArray.length === 0
                        } onClick={(e) => {
                            getRequirement(e, -1);
                        }}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span>{currentjobReq}</span>
                        <button type="button" className="iconButton" role="button" disabled={currentjobReq >= jobReqArray.length || jobReqArray.length === 0} onClick={
                            (e) => {
                                getRequirement(e, 1);
                            }
                        }>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>

                        <button type="button" className="btn btn-primary" onClick={(e) => {
                            addJobReq(e);
                        }}>Add Job Requirement</button>

                        <button type="button" className="btn btn-danger" onClick={(e) => {
                            deleteJobReq(e)
                        }} hidden={jobReqArray.length === 0}>Delete Job Requirement</button>
                    </div>
                    
                    
            
                    <div className="mb-3">
                        <label htmlFor="minCgpaReq" className="form-label">Minimum CGPA Required</label>
                        <input type="number" step="0.01" className="form-control" id="minCgpaReq" ref={minCgpaRequired} required/>
                    </div>

                    <div className="mb-3">
                    <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
                    </div>
                    
                    
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {msg && <Alert variant='success'>{msg}</Alert>}
                
            </form>
        </div>  
    );
}