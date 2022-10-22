import React, { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { getDateString } from "../utilFunc";
import { Modal, Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import TextAnim from "../components/textAnim.js";
import Lottie from 'lottie-react';
import loader from '../assets/97952-loading-animation-blue.json';

export default function ViewStudent(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [details, setDetails] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const location = useLocation();
    const [msg, setMsg] = useState();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const [appliedRec, setAppliedRec] = useState();
    const [modalError, setModalError] = useState();
    const [modalLoading, setModalLoading] = useState(true);
    const [placedCompanyName, setPlacedCompanyName] = useState(null);
    const placedCompanyRef = useRef();

    const sid = location.state.id;


    const filterRecruiter = function (arr){
        let newarr = [];
        for(var i = 0; i< arr.length; i++){
            if(arr[i].hiringStatus === 1){
                newarr.push(arr[i]);
            }
        }
        return newarr
    }


    const handleClose = () => setShow(false);
    const handleShow = () => {
        setModalLoading(true)
        setModalError()
        getApplied()
        .then((res) => {
            const respData = res.data;
            if(respData.sts === "failure"){
                setModalError('Failed to Load')
            }
            else{
                respData.data = filterRecruiter(respData.data);
                setAppliedRec(respData.data);
            }
            setModalLoading(false)
        })
        .catch((err) => {
            setModalError('Failed to Load')
            setModalLoading(false)
        })
        setShow(true);
    }



    const startFetch = function(){
        setLoading(true);
        setError();
    }


    const getApplied = function(){
        const reqUrl = url + '/getApplied';
        return axios.get(reqUrl, {
            params: {
                sid: sid
            }
        });
    }


    const fetchCompanyName = function (id) {
        const reqUrl = url + '/getRecruiters/' + id;
        return axios.get(reqUrl);
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
                    if(respData.data.placedAt !== null){
                        return fetchCompanyName(respData.data.placedAt);
                    }
                    return true;
                }
                
             })
             .then((res) => {
                if(res !== true){
                    const respData = res.data;
                    if(respData.sts === "failure"){
                        setError('Failed to Load')
                    }
                    else{
                        setPlacedCompanyName(respData.data.name);
                    }
                }
                setLoading(false);
             })
             .catch((err) => {
                console.log(err);
                setLoading(false);
                setError('Failed to Load')
             })
    }, []);



    const changePlacementStatus = function (placedAt) {
        const reqUrl = url + '/updatePlacedAt/' + sid;
        return axios.patch(reqUrl, {
            placedAt: placedAt
        });
    }

    const getCompanyName =function (placedAt){
        for(var i = 0; i < appliedRec.length; i++){
            if(appliedRec[i].id === Number.parseInt(placedAt)){
                return appliedRec[i].name;
            }
        }
        return null
    }


    const handleModalFormSubmit = function (){
        const placedAt = placedCompanyRef.current.value;
        setModalLoading(true);
        changePlacementStatus(placedAt)
        .then((res) => {
            const respData = res.data;
            if(respData.sts === "failure"){
                setModalError('Failed to Update')
            }
            else{
                setPlacedCompanyName(getCompanyName(placedAt))
                handleClose()
            }
            setModalLoading(false);
        })
        .catch((err) => {
            setModalError('Failed to update');
            setModalLoading(false);
        })
    }




    return (

        
        
        <div className="safeArea text-center">

            { loading && <Lottie animationData={loader} loop={true} className="loaderAnimation"></Lottie>}
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
                <p>{details.email}</p>
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
                <br />
                <br />
                {
                    placedCompanyName !== null
                    &&
                    <center>
                        <TextAnim primaryText="Placed" secondaryText={`at ${placedCompanyName}`}/>
                    </center>
                    
                }
                {
                    placedCompanyName === null
                    &&
                    <button type="button" className="btn btn-primary" onClick={((e) => {
                        handleShow();
                    })}>Change Placement Status</button>
                }
                

                <Modal show={show} onHide={handleClose} dialogClassName="modal-width">
                        <Modal.Header closeButton>
                        <Modal.Title>Change Placement Status</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {modalLoading && <Lottie animationData={loader} loop={true} className="loaderAnimation"></Lottie>}
                        {
                            !modalLoading 
                            &&
                            <form>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="companyDropDownSelect">Choose the Company</label>
                                    <select className="form-select" id="companyDropDownSelect" placeholder="Choose the Company" ref={placedCompanyRef}>
                                        {
                                            appliedRec.map((element, index) => {
                                                return (
                                                    <option key={index} value={appliedRec[index].id}>{appliedRec[index].name + ' - ' + appliedRec[index].jobRole} </option>
                                                );
                                            })
                                        }
                                        
                                    </select>
                                </div>                
                            </form>    
                        }

                        {
                            !modalLoading && modalError !== undefined 
                            &&
                            <center>
                                <Alert variant="danger">{modalError}</Alert>
                            </center>
                        }
                        
                    </Modal.Body>
                        <Modal.Footer>
                        <Button variant='primary' onClick={handleModalFormSubmit}>Done</Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        </Modal.Footer>
                </Modal>

                </>
                
            }
        
        </div>

    

    );
}