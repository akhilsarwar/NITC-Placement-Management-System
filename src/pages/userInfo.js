import React, { useEffect, useState } from "react";
import '../styles/userInfo.css';
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoaderAnim from "../components/loadingAnim";
import { getDateString } from "../utilFunc";

export default function UserInfo () {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [details, setDetails] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    
    const navigate = useNavigate();

    const startFetch = function(){
        setLoading(true);
        setError();
    }

    const handleEditProfile = async function (){
        setLoading(true); 
        const stateObj = JSON.parse(JSON.stringify(details));
        stateObj['isSignUpUpdation'] = false;
        console.log(stateObj)
        navigate('/updateProfile', {state : stateObj, replace: false});
        setLoading(false);
    }

    useEffect(() =>  {
        startFetch();
        const reqUrl = url + '/userInfo/' + currentUser.uid;
        console.log(role)
        axios.get(reqUrl, {
            params: {
                role: role
            }
        })
             .then((res) => {
                var respData = res.data;
                setDetails(respData);
                setLoading(false);
             })
             .catch((err) => {
                setLoading(false);
                setError('Failed to Load')
                console.log(err);
             });
    }, []);

    return (
        <>
            {loading && <LoaderAnim/>}
            {error && <center><h1>{error}</h1></center>}
            {!loading
                &&

            <div className='safeArea userInfoContainer'>
                {role==="Placement Coordinator" && <p>PLACEMENT COORDINATOR</p>}
                <div className='userIcon'>
                <FontAwesomeIcon icon={faCircleUser}/>
                </div>
                <br/>
                <h1>{details.name}</h1>
                <br/>
                {role === "Student" && 
                    <>
                    <h4>Roll No</h4>
                    <p>{details.rollNo}</p>
                    <br/>
                    <h4>Branch</h4>
                    <p>{details.branch}</p>
                    <br/>
                    <h4>Stream</h4>
                    <p>{details.stream}</p>
                    <br/>
                    <h4>CGPA</h4>
                    <p><b>{details.cgpa}</b></p>
                    <br/>
                    </>
                    
                }
                {
                    role==="Placement Coordinator"
                    &&
                    <>
                    <h4>Department</h4>
                    <p>{ details.department }</p>
                    <br/>
                    <h4>POST</h4>
                    <p>{ details.post }</p>
                    <br/><br/>
                    </>
                    
                }
                <h4>Address</h4>
                <p>{details.address}</p>
                <br/>
                <h4>Email</h4>
                <p>{details.email}</p>
                <br/>
                <h4>Contact Info</h4>
                <p>{details.contact }</p>
                <br/>
                <h4>Date of Birth</h4>
                <p>{getDateString(details.dob, 1)}</p>
                <br/>
                {
                    role==="Student" 
                    &&
                    <>
                    <button type="button" className="btn btn-secondary btn-lg">Download Resume</button>
                    <br />
                    <br />
                    </>
                    
                }
                
                <button type="button" className="btn btn-lg btn-primary" onClick={() => {
                    handleEditProfile();
                }} disabled={loading}>Edit Profile</button>
            </div>

            }
            
        </>
        
        
    );
}