import React, { useState } from "react";
import '../styles/login.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

export default function Login () {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState();
    
    
    const handleSubmit = async function (e) {
        e.preventDefault();
        try{
            setError();
            setLoading(true);
            await login(email, password);
            // console.log('success-login')
            navigate('/', {state: {}, replace: false});
        }
        catch{
            setError('Login failure');
        }
        setLoading(false);
    }

    
    return (

        <div className="card loginForm">
            <h2 className="login-title mt-4 mb-4">
                         Sign In
                     </h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <form  onSubmit={(e) => {
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
    
            
            <center><button type="submit" className="btn btn-primary btn-block mb-4" disabled={loading}>Sign In</button></center>
    
            
            <div className="text-center">
                <p>Not a member? <Link to='/signup'>Sign Up</Link></p>
                {/* <p>Already a member ? <Link to='/signup'>Login</Link></p> */}
            </div>
        </form> 
        </div>    
        
            
        );
}