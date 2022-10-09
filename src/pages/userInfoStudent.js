import React, { useEffect, useState } from "react";
import '../styles/userInfoStudent.css';
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoaderAnim from "../components/loadingAnim";

export default function UserInfoStudent () {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [details, setDetails] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser } = useAuth();
    const reqUrl = url + '/studentDetails/' + currentUser.uid;

    const startFetch = function(){
        setLoading(true);
        setError();
    }

    const  toJavascriptDate = function (details){
        let date = new Date(details.dob)
        // console.log(date)
        let day = String(date.getDate());
        if(day.length === 1){
            day = "0" + day;
        }
        let month = String(date.getMonth() + 1);
        if(month.length === 1){
            month = "0" + month;
        }
        let year = String (date.getFullYear());
        details.dob = day + '-' + month + '-' + year;
        return details;
    }

    useEffect(() =>  {
        startFetch();
        axios.get(reqUrl)
             .then((res) => {
                setDetails(toJavascriptDate(res.data));
                setLoading(false);
             })
             .catch((err) => {
                setLoading(false);
                setError('Failed to Load')
                console.log(err);
             });
    }, [reqUrl]);

    return (
        <>
            {loading && <LoaderAnim/>}
            {error && <center><h1>{error}</h1></center>}
            {!loading
                &&

            <div className='userInfoStudentContainer'>
                <div className='userIcon'>
                <FontAwesomeIcon icon={faCircleUser}/>
                </div>
                <br/>
                <h1>{details.name}</h1>
                <br/>
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
                <p>{details.dob }</p>
                <br/>
                <button type="button" className="btn btn-secondary btn-lg">Download Resume</button>
            </div>
            }
            
        </>
        
        
    );
}