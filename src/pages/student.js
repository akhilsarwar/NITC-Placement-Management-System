import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/recruiter.css'
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import TableView from "../components/tableView";
import Lottie from 'lottie-react';
import loader from '../assets/97952-loading-animation-blue.json';

export default function Student(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [recArray, setRecArray] = useState();
    const searchRef = useRef();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const navigate = useNavigate();

    const startFetch = function(){
        setLoading(true);
        setError();
    }

    const setPlacementStatus = function (arr) {
        for(var i = 0; i < arr.length; i++){
            if(arr[i].placedAt !== null){
                arr[i]['placementStatus'] = <span style={{color: "green"}}><b>Placed</b></span>
            }
            else{
                arr[i]['placementStatus'] = <span style={{color: "orange"}}><b>Not Placed</b></span>
            }
        }
    }

    const fetchStudents = function (filterString) {
        startFetch();
        let reqUrl = url + '/getStudents';
        reqUrl += `?filterString=${filterString}`;
        reqUrl += `&filterOn=${JSON.stringify(['name', 'rollNo', 'stream'])}`;
        
        axios.get(reqUrl, {})
             .then((res) => {
                //TODO: assign data to the table
                const respData = res.data;
                if(respData.sts === "failure"){
                    setError('Failed to Load')
                }
                else{
                    setPlacementStatus(respData.data);
                    setRecArray(respData.data); 
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

    useEffect(()=>{
        fetchStudents('');
    }, []);


    return (
        <div className="safeArea">
        <h1 className="mb-4">Students</h1>

        <div className="input-group mb-4 searchBar">
            <div className="form-floating">
              <input type="search" id="searchField" className="form-control" placeholder="Search" ref={searchRef}/>
              <label className="form-label" htmlFor="searchField">Search</label>
            </div>
            <button type="button" className="btn btn-primary search" style={{height: "58px"}} onClick={()=> {
                fetchStudents(searchRef.current.value);
            }}>
            <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        
        {
            loading
            &&
            <Lottie animationData={loader} loop={true} className="loaderAnimation"></Lottie>
        }
          
        {!loading && recArray.length > 0 && 
        <TableView tableHeads={["Name", "Roll No", "Stream", "Status", "Action"]} tableData={recArray} displayFields={["name", "rollNo","stream", "placementStatus"]} dataViewLink='/viewStudent' idField="uid"/>
        }

        {!loading && recArray.length == 0 && 
            <center>
                <h2>No Data</h2>
            </center>
        }
                   
        </div>
    );
}