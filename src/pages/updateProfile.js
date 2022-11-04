//TODO: update profile pending for placement coordinator

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext.js';
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import '../styles/avatar.css';
import { getDateString } from "../utilFunc.js";
import { faCircleUser, faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UpdateProfile(){

    const profileImage = useRef();
    const profileImageView = useRef();
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
    const department = useRef();
    const post = useRef();

    const navigate = useNavigate();

    const location = useLocation();
    const profileImage_ = location.state.image;
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
    const department_ = location.state.department
    const post_ = location.state.post;

    const { currentUser, role } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [msg, setMsg] = useState();
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [userIconAvatarView, setUserIconAvatarView] = useState(false);

    const startFetch = function(){
        setLoading(true);
        setError();
        setMsg();
    }

    const handleSubmit = function (event){    
        event.preventDefault();
        const url = process.env.REACT_APP_BACKEND_URL +  '/updateUserProfile/' + currentUser.uid;
        startFetch();
        const formData = new FormData();
        formData.append('name', name.current ? name.current.value: null);
        formData.append('rollNo' , rollNo.current ? rollNo.current.value: null);
        formData.append('email', email.current ? email.current.value: null);
        formData.append('branch' , branch.current ? branch.current.value: null);
        formData.append('stream' , stream.current ? stream.current.value: null);
        formData.append('address' , address.current ? address.current.value: null);
        formData.append('contact' , contact.current ? contact.current.value: null);
        if(role === "Student")
            formData.append('resume', resume.current.files.length ? resume.current.files[0]: null, 'resume');
        formData.append('profileImage', profileImage.current.files.length ? profileImage.current.files[0]: null, 'profileImage');
        formData.append('dob' , dob.current ? dob.current.value: null);
        formData.append('cgpa', cgpa.current ? cgpa.current.value: null);
        formData.append('post', post.current ? post.current.value: null);
        formData.append('department', department.current ? department.current.value: null);
        formData.append('role',  role);

        axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }            
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
        <div className="safeArea" >
        <h1 className="mb-4">Update Profile Info</h1>
        <form onSubmit={(e)=>{handleSubmit(e);}}>

            <div className="avatar-wrapper mb-3">
                <input className="file-upload" type="file" accept="image/*" ref={profileImage} defaultValue= {profileImage_} onChange={(e) => {
                    if(e.target.files.length !== 0){
                        console.log(e.target.files)
                        var file = e.target.files[0];
                        var fr = new FileReader();
                        fr.onload = () => {
                            setProfileImageUrl(fr.result)
                            setUserIconAvatarView(true);
                        }
                        fr.readAsDataURL(file);    
                    }
                    
                }} required/> 
                <div className="upload-button" onClick={()=> {
                    profileImage.current.click();
                }}>
                    <FontAwesomeIcon icon={faCircleUser} className="circular-user" hidden={userIconAvatarView}/>
                    <FontAwesomeIcon icon={faArrowCircleUp} className="arrow-circle-up-icon"/>
                    <img src={profileImageUrl} alt="No image" ref={profileImageView} hidden={!userIconAvatarView}/>    
                </div>
                
            </div>

            

            <div className="mb-3">
              <label htmlFor="nameUpdate" className="form-label">Name</label>
              <input type="text" className="form-control" id="nameUpdate" aria-describedby="nameHelp" ref={name} defaultValue= {name_} required/>

            </div>
            <div className="mb-3">
              <label htmlFor="emailUpdate" className="form-label">Email</label>
              <input type="text" className="form-control" id="emailUpdate" ref={email} defaultValue={email_}  required/>
            </div>
            {
                role==="Student"
                &&
                <>
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
                        <label htmlFor="cgpaUpdate" className="form-label">CGPA</label>
                        <input type="number" step="0.01" className="form-control" id="cgpaUpdate" ref={cgpa} defaultValue= {cgpa_}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="resumeUpdate">Upload Resume</label>
                        <input type="file" className="form-control" id="resumeUpdate" ref={resume} defaultValue= {resume_} accept="application/pdf" required/>
                    </div>
                </>
                
            }
            
            {
                role==="Placement Coordinator"
                &&
                <>
                    <div className="mb-3">
                        <label htmlFor="departmentUpdate" className="form-label">Department</label>
                        <input type="text" className="form-control" id="departmentUpdate" ref={department} defaultValue= {department_} required/>
                    </div>    
                    <div className="mb-3">
                        <label htmlFor="postUpdate" className="form-label">Post</label>
                        <input type="text" className="form-control" id="postUpdate" ref={post} defaultValue= {post_} required/>
                    </div>    
                </>
                
            }
        

            <div className="mb-3">
                <label htmlFor="addressUpdate" className="form-label">Address</label>
                <textarea className="form-control rounded-0" id="addressUpdate" rows="10" ref={address} defaultValue= {address_} required></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="contactUpdate" className="form-label">Contact</label>
                <input type="number" className="form-control" id="contactUpdate" ref={contact} defaultValue= {contact_} required/>
            </div>

            

            <div className="mb-3">
                <label htmlFor="dobUpdate" className="form-label">Date of Birth</label>
                <input type="date" className="form-control" id="dobUpdate" ref={dob} defaultValue= {getDateString(dob_, 0)}/>
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