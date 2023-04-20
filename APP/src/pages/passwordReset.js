import React, { useState } from "react";
import '../styles/login.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

export default function ResetPassword () {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [error, setError] = useState();
    const [message, setMessage] = useState();
    
    
    const handleSubmit = async function (e) {
        e.preventDefault();
        try{
            setError();
            setLoading(true);
            await resetPassword(email);
            setMessage('Password Reset Successful. Check Inbox for reset mail');
        }
        catch{
            setError('Password Reset Operation Failed');
        }
        setLoading(false);
    }

    
    return (

        <div className="card loginForm">
            <h2 className="login-title mt-4 mb-4">
                         Password Reset
                     </h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            {(!error && message) && <Alert variant="success">{message}</Alert>}
            <form  onSubmit={(e) => {
                            handleSubmit(e);
                        }}>
            <div className="form-outline mb-4">
                <input type="email" id="email" className="form-control" placeholder="example@gmail.com" onChange={(e) => {
                            setEmail(e.target.value);
                        }} required/>
                <label className="form-label" htmlFor="email">Email address</label>
            </div>
            
            <center><button type="submit" className="btn btn-primary btn-block mb-4" disabled={loading}>Reset Password</button></center>
    
            
            <div className="text-center">
                <p>Not a member? <Link to='/signup'>Sign Up</Link></p>
            </div>
            <div className="text-center">
            <p>Already a member ? <Link to='/login'>Login</Link></p>
            </div>
        </form> 
        </div>    
        
            
        );
}