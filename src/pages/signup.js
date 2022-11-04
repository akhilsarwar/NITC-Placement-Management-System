import React, { useState, useRef } from "react";
import '../styles/login.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";


export default function SignUp () {

    // const location = useLocation();
    
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [retypePassword, setRetypePassword] = useState();
    const [error, setError] = useState();
    const { signUp, setUserRole } = useAuth(); 
    const [loading, setLoading] = useState(false);
    const role = useRef(null);
    
    const navigate = useNavigate();

    const checkIfValidPCEmail = async function (){
        console.log(email)
        const docRef = doc(db, "pc", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            return true;
        }
        else{
            return false;
        }
    }



    const registerUser = async function (email, password, role){
        const user = await signUp(email, password);
        const userId = user.user.uid;
        console.log(userId);
        console.log(role);
        await setUserRole(userId, role);
    }

    const navigateToUpdateProfile = function (email){
        navigate('/updateProfile', {state: {'email': email, 'isSignUpUpdation': true}, replace: false});
    }

    const handleSubmit = async function (e) {
        e.preventDefault();
        // console.log(role.current.value);
        if(password === retypePassword){
            try{
                setError();
                setLoading(true);
                let isPc = false
                
                if(role.current.value === "Placement Coordinator"){
                    console.log('here********   ')
                    isPc = await checkIfValidPCEmail();
                    console.log(isPc)
                    if(isPc){
                        await registerUser(email, password, role.current.value)
                        navigateToUpdateProfile(email);   
                    }
                    else{
                        setError('Not a valid PC mail id');
                    }
                }
                else{
                    await registerUser(email, password, role.current.value)
                    navigateToUpdateProfile(email);
                }
            }
            catch(err){
                setError('Sign Up Failed')
                console.log(err)
            }
        }
        else{
            setError('Passwords do not match');
            console.log(error)
        }

        // console.log('success')
        setLoading(false);
    }


    return (

    <div className="card loginForm">
        <h2 className="login-title mt-4 mb-4">
                     Sign Up
                 </h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <form   onSubmit={(e) => {
                        handleSubmit(e);
                    }}>
        <div className="form-outline mb-4">
            <input type="email" id="email" className="form-control" placeholder="example@gmail.com" onChange={(e) => {
                        setEmail(e.target.value);
                    }} required/>
            <label className="form-label" htmlFor="email">Email address</label>
        </div>

        
        <div className="form-outline mb-4">
            <input type="password" id="password" className="form-control" onChange={(e) => {
                        setPassword(e.target.value);
                    }} required/>
            <label className="form-label" htmlFor="password">Password</label>
        </div>

        <div className="form-outline mb-4">
            <input type="password" id="retype-password" className="form-control" onChange={(e) => {
                        setRetypePassword(e.target.value);
                    }} required/>
            <label className="form-label" htmlFor="retype-password">Retype Password</label>
        </div>

        
        <div className="row mb-4">
            <div className="col d-flex justify-content-center">
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="form2Example31"/>
                <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
            </div>
            </div>

            <div className="col">
            
            <Link to="/resetPassword">Forgot password?</Link>
            </div>
        </div>

        
        {/* choose role student or placement coordinator */}
        <div className="input-group mb-4">
            <label className="input-group-text" htmlFor="inputGroupSelect01">Choose Role</label>
            <select className="form-select" id="inputGroupSelect01" placeholder="Choose Role" ref={role}>
                <option value="Student">Student</option>
                <option value="Placement Coordinator">Placement Coordinator</option>
            </select>
        </div>

        
        <center><button type="sumbit" className="btn btn-primary btn-block mb-4" disabled={loading}>Sign Up</button></center>

        
        <div className="text-center">
            {/* <p>Not a member? <a href="#!">Register</a></p> */}
            <p>Already a member ? <Link to='/login'>Login</Link></p>
        </div>
    </form> 
    </div>    
    
        
    );
}