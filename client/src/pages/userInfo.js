import React, { useEffect, useState, useRef } from "react";
import '../styles/userInfo.css';
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Lottie from 'lottie-react';
import loader from '../assets/97952-loading-animation-blue.json';
import '../styles/avatar.css';
import { getDateString } from "../utilFunc";
import TextAnim from "../components/textAnim.js";
import { Modal, Button } from "react-bootstrap";


export default function UserInfo() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [details, setDetails] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const [placedCompany, setPlacedCompany] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(true);
    const [resumeError, setResumeError] = useState();
    const [resumeURL, setResumeURL] = useState();
    const [show, setShow] = useState(false);
    const [userIconAvatarView, setUserIconAvatarView] = useState(false);
    const profileImageView = useRef();
    const [profileImageUrl, setProfileImageUrl] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (event) => {
        setShow(true)
    };

    const navigate = useNavigate();

    const startFetch = function () {
        setLoading(true);
        setError();
    }

    const handleEditProfile = async function () {
        setLoading(true);
        const stateObj = JSON.parse(JSON.stringify(details));
        stateObj['isSignUpUpdation'] = false;
        console.log(stateObj)
        navigate('/updateProfile', { state: stateObj, replace: false });
        setLoading(false);
    }


    const fetchCompanyName = function (id) {
        const reqUrl = url + '/recruiter/getRecruiters/' + id;
        return axios.get(reqUrl);
    }



    const fetchResume = function (id) {
        const reqUrl = url + '/student/getResume/' + id;
        setResumeLoading(true);
        setResumeError();
        axios.get(reqUrl)
            .then(res => {
                var respData = res.data;
                if (respData.sts === "failure") {
                    throw "File not received"
                }
                else {
                    if (respData.data !== null) {
                        const arr = new Uint8Array(respData.data.data);
                        const blob = new Blob([arr], { type: 'application/pdf' });
                        const resURL = URL.createObjectURL(blob);
                        setResumeURL(resURL);
                    }
                    else {
                        setResumeError('No Resume Found');
                    }
                    // window.open(resURL);
                }
                setResumeLoading(false);
            }).catch((err) => {
                setResumeLoading(false);
                setResumeError('Resume Load Failed');
            });
    }


    const fetchProfileImage = function (id) {
        const reqUrl = url + '/userInfo/getProfileImage/' + id;
        return axios.get(reqUrl);
    }



    useEffect(() => {
        let userDetails = {}
        startFetch();
        const reqUrl = url + '/userInfo/' + currentUser.uid;
        axios.get(reqUrl, {
            params: {
                role: role
            }
        })
            .then((res) => {
                var respData = res.data;
                if (respData.sts === "failure") {
                    throw "Failed to Load Data"
                }
                else {
                    userDetails = respData.data;
                    setDetails(userDetails);
                    return fetchProfileImage(currentUser.uid);
                }
            })
            .then((res) => {
                var respData = res.data;
                if (respData.sts === "failure") {
                    throw "Failed to Load Data"
                }
                else {
                    if (respData.data !== null) {
                        const arr = new Uint8Array(respData.data.data);
                        const blob = new Blob([arr], { type: 'image/jpeg' });
                        const imgURL = URL.createObjectURL(blob);
                        setProfileImageUrl(imgURL);
                        setUserIconAvatarView(true);
                    }

                    if (role === "Student") {
                        if (userDetails.placedAt !== null) {
                            return fetchCompanyName(userDetails.placedAt);
                        }
                    }
                    return true;
                }
            })
            .then((res) => {
                if (res !== true) {
                    var respData = res.data;
                    console.log(respData)
                    if (respData.sts === "failure") {
                        throw "Failed to load data";
                    }
                    else {
                        setPlacedCompany(respData.data.name);
                    }
                }
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
            {loading && <Lottie animationData={loader} loop={true} className="loaderAnimation"></Lottie>}
            {error && <center><h1>{error}</h1></center>}
            {!loading
                &&

                <div className='safeArea userInfoContainer'>

                    {
                        role === "Student"
                        &&
                        details.placedAt !== null
                        &&
                        <center>
                            <TextAnim primaryText="Congratulations" secondaryText={`You are placed at ${placedCompany}`} />
                        </center>

                    }



                    {role === "Placement Coordinator" && <p>PLACEMENT COORDINATOR</p>}

                    <div className="avatar-wrapper mb-3">
                        <div className="upload-button">
                            <FontAwesomeIcon icon={faCircleUser} className="circular-user" hidden={userIconAvatarView} />
                            <img src={profileImageUrl} alt="No image" ref={profileImageView} hidden={!userIconAvatarView} />
                        </div>
                    </div>


                    <br />
                    <h1>{details.name}</h1>
                    <br />
                    {role === "Student" &&
                        <>
                            <h4>Roll No</h4>
                            <p>{details.rollNo}</p>
                            <br />
                            <h4>Branch</h4>
                            <p>{details.branch}</p>
                            <br />
                            <h4>Stream</h4>
                            <p>{details.stream}</p>
                            <br />
                            <h4>CGPA</h4>
                            <p><b>{details.cgpa}</b></p>
                            <br />
                        </>

                    }
                    {
                        role === "Placement Coordinator"
                        &&
                        <>
                            <h4>Department</h4>
                            <p>{details.department}</p>
                            <br />
                            <h4>POST</h4>
                            <p>{details.post}</p>
                            <br />
                        </>

                    }
                    <h4>Address</h4>
                    <p>{details.address}</p>
                    <br />
                    <h4>Email</h4>
                    <p>{details.email}</p>
                    <br />
                    <h4>Contact Info</h4>
                    <p>{details.contact}</p>
                    <br />
                    <h4>Date of Birth</h4>
                    <p>{getDateString(details.dob, 1)}</p>
                    <br />
                    {
                        role === "Student"
                        &&
                        <>
                            <button type="button" className="btn btn-secondary btn-lg" onClick={() => { handleShow(); fetchResume(currentUser.uid) }}>Download Resume</button>
                            <br />
                            <br />
                        </>

                    }

                    <button type="button" className="btn btn-lg btn-primary" onClick={() => {
                        handleEditProfile();
                    }} disabled={loading}>Edit Profile</button>
                </div>

            }



            <Modal show={show} onHide={handleClose} dialogClassName="modal-width">
                <Modal.Header closeButton>
                    <Modal.Title>CV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Document file={cvNow}>
                <Page pageNumber={1} />
            </Document> */}
                    {
                        !resumeLoading
                        &&
                        resumeError === undefined
                        &&
                        <object width="100%" height="600px" data={resumeURL} type="application/pdf">   </object>
                    }
                    {
                        !resumeLoading
                        &&
                        resumeError !== undefined
                        &&
                        <center>
                            {resumeError}
                        </center>
                    }
                    {
                        resumeLoading
                        &&
                        <Lottie animationData={loader} loop={true} className="loaderAnimation"></Lottie>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>


    );
}