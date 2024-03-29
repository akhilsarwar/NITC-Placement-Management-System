import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { faCheck, faClock, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/recruiter.css'
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import TableView from "../components/tableView";
import Lottie from 'lottie-react';
import loader from '../assets/97952-loading-animation-blue.json';

export default function Recruiter() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [recArray, setRecArray] = useState();
    const [appliedRec, setAppliedRec] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef();

    const startFetch = function () {
        setLoading(true);
        setError();
    }

    const setHiringStatusIcon = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].hiringStatus === 1) {
                arr[i]['hiringIcon'] = <span>
                    <FontAwesomeIcon icon={faClock} className="me-2" style={{ color: "orange" }} />
                    Pending
                </span>
            } else {
                arr[i]['hiringIcon'] = <span>
                    <FontAwesomeIcon icon={faCheck} className="me-2"
                        style={{ color: "green" }} />
                    Hiring Over
                </span>
            }
        }
    }

    const getApplied = function () {
        const reqUrl = url + '/student/getApplied';
        return axios.get(reqUrl, {
            params: {
                sid: currentUser.uid
            }
        });
    }


    //fetching recruiters filtered for columns - Company, Job Role, Job Location
    const fetchRecruiters = function (filterString) {
        startFetch();
        let reqUrl = url + '/recruiter/getRecruiters';
        reqUrl += `?role=${role}`
        reqUrl += `&uid=${currentUser.uid}`
        reqUrl += `&filterString=${filterString}`
        reqUrl += `&filterOn=${JSON.stringify(['name', 'jobRole', 'jobLocation'])}`

        axios.get(reqUrl, {})
            .then((res) => {
                //TODO: assign data to the table
                const respData = res.data;
                if (respData.sts === "failure") {
                    setError('Failed to Load')
                }
                else {
                    setHiringStatusIcon(respData.data);
                    setRecArray(respData.data);

                }
                if (role === "Student") {
                    return getApplied()
                }
                else {
                    return true;
                }

            })
            .then((res) => {

                if (role === "Student") {
                    const respData = res.data;
                    setHiringStatusIcon(respData.data);
                    setAppliedRec(respData.data);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setError('Failed to Load')
                console.log(err);
            })
    }



    useEffect(() => {
        fetchRecruiters('');
    }, []);



    return (
        <div className="safeArea">
            <h1 className="mb-4">Recruiters</h1>

            <div className="input-group mb-4 searchBar">
                <div className="form-floating">
                    <input type="search" id="searchField" className="form-control" placeholder="Search" ref={searchRef} />
                    <label className="form-label" htmlFor="searchField">Search</label>
                </div>
                <button type="button" className="btn btn-primary search" style={{ height: "58px" }} onClick={() => {
                    fetchRecruiters(searchRef.current.value);
                }}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            {
                role === "Placement Coordinator"
                &&
                <div className="mb-4">
                    <button type="button" className="btn btn-primary" onClick={(e) => { navigate('/addRecruiter', { state: {}, replace: false }) }}>Add Recruiter</button>
                </div>
            }


            {
                loading
                &&
                // <LoaderAnim/>
                <Lottie animationData={loader} loop={true} className="loaderAnimation"></Lottie>
            }

            {!loading && recArray.length > 0 &&
                <TableView tableHeads={["Company", "Job Role", "CTC", "Job Location", "Hiring Status", "Action"]} tableData={recArray} displayFields={["name", "jobRole", "ctc", "jobLocation", "hiringIcon"]} dataViewLink='/viewRecruiter' idField="id" />
            }

            {!loading && recArray.length == 0 &&
                <center>
                    <h2>No Data</h2>
                </center>
            }

            {
                role == "Student"
                &&
                <>
                    {!loading &&

                        <h2 style={{ marginTop: "100px" }} className="mb-4">Applied</h2>
                    }
                    {
                        !loading && appliedRec.length > 0
                        &&
                        <>

                            <TableView tableHeads={["Company", "Job Role", "CTC", "Job Location", "Hiring Status", "Action"]} tableData={appliedRec} displayFields={["name", "jobRole", "ctc", "jobLocation", "hiringIcon"]} dataViewLink='/viewRecruiter' idField="id" />
                        </>

                    }
                    {!loading && appliedRec.length == 0 &&
                        <center>
                            <h2>No Data</h2>
                        </center>
                    }
                </>
            }

        </div>
    );
}