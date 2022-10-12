//TODO: update profile pending for placement coordinator

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext.js';
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import '../styles/updateProfile.css'

export default function UpdateProfile(){

    const name = useRef();
    const email = useRef();
    const rollNo = useRef();
    const branch = useRef();
    const stream = useRef();
    const address = useRef();
    const contact = useRef();
    const resume = useRef();
    const dob = useRef();
    const cgpa = useRef();

    const navigate = useNavigate();

    const location = useLocation();
    const name_  = location.state.name
    const email_  = location.state.email
    const rollNo_  = location.state.rollNo
    const branch_  = location.state.branch
    const stream_  = location.state.stream
    const address_  = location.state.address
    const contact_  = location.state.contact
    const resume_  = location.state.resume
    const dob_  = location.state.dob
    const cgpa_  = location.state.cgpa
    const isSignUpUpdation_ = location.state.isSignUpUpdation

    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [msg, setMsg] = useState();

    const startFetch = function(){
        setLoading(true);
        setError();
        setMsg();
    }

    const handleSubmit = function (event){    
        event.preventDefault();
        const url = process.env.REACT_APP_BACKEND_URL +  '/updateUserProfile/' + currentUser.uid;
        startFetch();
        axios.post(url, {
            'name': name.current.value,
            'rollNo' : rollNo.current.value,
            'email': email.current.value,
            'branch' : branch.current.value,
            'stream' : stream.current.value,
            'address' : address.current.value,
            'contact' : contact.current.value,
            'resume' : resume.current.value,
            'dob' : dob.current.value,
            'cgpa': cgpa.current.value
        }).then((result) => {
            const respData = result.data;
            if(respData.sts === "failure"){
                setError('Server side Issue. Update Failed')
            }
            else{
                setMsg('Update Successful')
                if(isSignUpUpdation_){
                    navigate('/', {state: {}, replace: false});
                }
            }
            setLoading(false);
            
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            setError('Update Failed. Try again');
        })
    }

    return(
        <div className="updateProfileContainer" >
        <h1 className="mb-4">Update Profile Info</h1>
        <form onSubmit={(e)=>{handleSubmit(e);}}>
            <div className="mb-3">
              <label htmlFor="nameUpdate" className="form-label">Name</label>
              <input type="text" className="form-control" id="nameUpdate" aria-describedby="nameHelp" ref={name} defaultValue= {name_} required/>

            </div>
            <div className="mb-3">
              <label htmlFor="emailUpdate" className="form-label">Email</label>
              <input type="text" className="form-control" id="emailUpdate" ref={email} defaultValue={email_}  required/>
            </div>
            <div className="mb-3">
              <label htmlFor="rollNoUpdate" className="form-label">Roll No</label>
              <input type="text" className="form-control" id="rollNoUpdate" ref={rollNo} defaultValue= {rollNo_} required/>
            </div>  
            <div className="mb-3">
                <label htmlFor="branchUpdate">Branch</label>
                <input type="text" className="form-control" id="branchUpdate" ref={branch} defaultValue= {branch_} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="streamUpdate">Stream</label>
                <input type="text" className="form-control" id="streamUpdate" ref={stream} defaultValue= {stream_} required/>
            </div>
        

            <div className="mb-3">
                <label htmlFor="addressUpdate" className="form-label">Address</label>
                <textarea className="form-control rounded-0" id="addressUpdate" rows="10" ref={address} defaultValue= {address_} required></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="contactUpdate" className="form-label">Contact</label>
                <input type="number" className="form-control" id="contactUpdate" ref={contact} defaultValue= {contact_} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="cgpaUpdate" className="form-label">CGPA</label>
                <input type="number" step="0.01" className="form-control" id="cgpaUpdate" ref={cgpa} defaultValue= {cgpa_}/>
            </div>

            <div className="mb-3">
                <label htmlFor="dobUpdate" className="form-label">Date of Birth</label>
                <input type="date" className="form-control" id="dobUpdate" ref={dob} defaultValue= {dob_}/>
            </div>  

            <div className="mb-3">
                <label className="form-label" htmlFor="resumeUpdate">Upload Resume</label>
                <input type="file" className="form-control" id="resumeUpdate" ref={resume} defaultValue= {resume_} required/>
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