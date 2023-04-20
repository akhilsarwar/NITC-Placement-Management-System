import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from 'lottie-react';
import loader from '../assets/97952-loading-animation-blue.json';
import { getDateString, getTimeString } from "../utilFunc";
import TextAnim from "../components/textAnim";
import ConfirmationDialog from "../components/confirmationDialog";

export default function ViewRecruiter() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [details, setDetails] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const location = useLocation();
    const [msg, setMsg] = useState();
    const navigate = useNavigate();
    const [hasApplied, setHasApplied] = useState();
    const [isPlaced, setIsPlaced] = useState();
    const [isHiring, setIsHiring] = useState();


    const rid = location.state.id;
    const confirmDialogRef = useRef();

    const startFetch = function () {
        setLoading(true);
        setError();
    }

    const getPlacementStatus = function () {
        const reqUrl = url + '/student/getPlacementStatus/' + currentUser.uid;
        return axios.get(reqUrl);
    }

    useEffect(() => {
        startFetch();
        const reqUrl = url + '/recruiter/getRecruiters/' + rid;

        axios.get(reqUrl, {})
            //getting the recruiter details
            .then((res) => {
                const respData = res.data;
                if (respData.sts === "failure") {
                    setError('Failed to Load')
                    //TODO: handle this case where data fails to load
                    throw "Failed to Load"
                }
                else {
                    respData.data.jobRequirements = JSON.parse(respData.data.jobRequirements);
                    setDetails(respData.data);
                    setIsHiring(respData.data.hiringStatus);
                }

                if (role === "Student")
                    return getAppliedStatus();
                else if (role === "Placement Coordinator") {
                    return true;
                }

            })
            .then((res) => {
                if (role === "Student") {
                    const respData = res.data;
                    if (respData.sts === "failure") {
                        setError('Failed to Load')
                        //TODO: handle this case where data fails to load
                        throw "Failed to Load"
                    }
                    else {
                        setHasApplied(respData.data);
                        return getPlacementStatus();
                    }
                }
                return true;
            })
            //finding whether the student is placed or not
            .then((res) => {
                if (role === "Student") {
                    const respData = res.data;
                    if (respData.sts === "failure") {
                        setError('Failed to Load')
                        //TODO: handle this case where data fails to load
                        throw "Failed to Load"
                    }
                    else {
                        setIsPlaced(respData.data);
                    }
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



    const handleDelete = function () {
        startFetch();
        const reqUrl = url + '/recruiter/deleteRecruiter/' + rid;
        axios.delete(reqUrl)
            .then((res) => {
                const respData = res.data;
                if (respData.sts === "failure") {
                    setError('Failed to Delete')
                }
                else {
                    setMsg('Deletion Successful')
                    navigate('/recruiter', { state: {}, replace: true });
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError('Failed to Delete')
            })
    }



    const handleApply = function () {
        startFetch();
        const reqUrl = url + '/student/apply';
        const dateNow = new Date().toISOString()
        axios.post(reqUrl, {
            sid: currentUser.uid,
            rid: rid,
            appliedTime: getDateString(dateNow, 0) + " " + getTimeString(dateNow)
        })
            .then((res) => {
                const respData = res.data;
                if (respData.sts === "failure") {
                    setError('Failed to Apply')
                }
                else {
                    setHasApplied(true);
                    setMsg('Successfully Applied')
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError('Failed to Apply')
            })

    }


    const getAppliedStatus = function () {
        const reqUrl = url + '/student/getAppliedStatus';
        return axios.get(reqUrl, {
            params: {
                sid: currentUser.uid,
                rid: rid
            }
        })
    }


    const changeHiringStatus = function () {
        confirmDialogRef.current.closeDialog();
        setLoading(true);
        const reqUrl = url + '/recruiter/changeHiringStatus/' + rid;
        axios.patch(reqUrl)
            .then((res) => {
                const respData = res.data;
                if (respData.sts === "failure") {
                    throw "error"
                }
                else {
                    setIsHiring(0);
                }
                setLoading(false);
            })
            .catch(err => {
                //TODO: Handle how to display the error --- toast notifications preferred or an Alert
                setLoading(false);
            });
    }



    return (


        <div className="safeArea text-center">

            {loading && <Lottie animationData={loader} loop={true} className="loaderAnimation"></Lottie>}
            {
                !loading
                &&
                <>
                    <h1>{details.name}</h1>
                    <br />
                    <h4>Job Role</h4>
                    <p>{details.jobRole}</p>
                    <br />
                    <h4>CTC</h4>
                    <p><b>{details.ctc}</b></p>
                    <br />
                    <h4>Job Location</h4>
                    <p>{details.jobLocation}</p>
                    <br />
                    <h4>Job Description</h4>
                    <p>{details.jobDescription}</p>

                    <br />
                    <h4>Requirements</h4>
                    {
                        (details.jobRequirements).map((element, index) => {
                            return (
                                <p key={index}>{element}</p>
                            );

                        })
                    }
                    <br />

                    <h4>Minimum Cgpa Required</h4>
                    <p><b>{details.minCgpaRequired}</b></p>
                    <br />

                    {
                        role === "Placement Coordinator"
                        &&
                        <div className="mb-3">
                            <button type="button" className="btn btn-danger btn-lg" onClick={() => {
                                handleDelete();
                            }}>Delete</button>
                        </div>


                    }
                    {
                        role === "Placement Coordinator"
                        && isHiring === 1 &&
                        <>
                            <div className="mb-3">
                                <button type="button" className="btn btn-danger btn-lg" onClick={() => {
                                    confirmDialogRef.current.openDialog();
                                }}>Change Hiring Status</button>
                            </div>


                            <ConfirmationDialog ref={confirmDialogRef} title="Turn off Hiring" dialogBody={
                                <p>
                                    Are you sure you want to turn off Hiring ?
                                </p>
                            } onModalConfirm={changeHiringStatus} />
                        </>

                    }

                    {
                        (role === "Student" && !hasApplied && !isPlaced && isHiring === 1)
                        &&
                        <div className="mb-3">
                            <button type="button" className="btn btn-success btn-lg" onClick={() => {
                                handleApply();
                            }}>Apply</button>
                        </div>

                    }
                    {
                        (role === "Student" && hasApplied && !isPlaced)
                        &&
                        <div className="mb-3">
                            <button type="button" className="btn btn-secondary btn-lg" disabled>Applied</button>
                        </div>

                    }
                    {
                        (role === "Student" && isPlaced)
                        &&
                        <center>
                            <TextAnim primaryText="Congratulations" secondaryText="You are already placed" />
                        </center>

                    }

                </>

            }

        </div>



    );
}