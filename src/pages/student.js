import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/recruiter.css'
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import TableView from "../components/tableView";
import LoaderAnim from "../components/loadingAnim";

export default function Student(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [recArray, setRecArray] = useState();
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, role } = useAuth();
    const navigate = useNavigate();

    const startFetch = function(){
        setLoading(true);
        setError();
    }

    useEffect(()=>{
        startFetch();
        const reqUrl = url + '/getStudents';
        
        axios.get(reqUrl, {})
             .then((res) => {
                //TODO: assign data to the table
                const respData = res.data;
                if(respData.sts === "failure"){
                    setError('Failed to Load')
                }
                else{
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
    }, []);


    return (
        <div className="safeArea">
        <h1 className="mb-4">Students</h1>

        <div className="input-group mb-4 searchBar">
            <div className="form-floating">
              <input type="search" id="searchField" className="form-control" placeholder="Search"/>
              <label className="form-label" htmlFor="searchField">Search</label>
            </div>
            <button type="button" className="btn btn-primary search" style={{height: "58px"}}>
            <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        
        {
            loading
            &&
            <LoaderAnim/>
        }
          
        {!loading && recArray.length > 0 && 
        <TableView tableHeads={["Name", "Roll No", "Branch", "Stream", "Action"]} tableData={recArray} displayFields={["name", "rollNo", "branch", "stream"]} dataViewLink='/viewStudent' idField="uid"/>
        }

        {!loading && recArray.length == 0 && 
            <center>
                <h2>No Data</h2>
            </center>
        }
                   
        </div>
    );
}