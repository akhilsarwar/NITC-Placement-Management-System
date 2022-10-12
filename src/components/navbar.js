import {React, useState} from "react";
import logo from '../assets/nitc_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faPeopleGroup, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import '../styles/navbar.css'

export default function NavBar (){

    const [showMenu, setShowMenu] = useState(false); 
    const navigate = useNavigate();
    const [focusTab, setFocusTab] = useState('home');
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const navigateHome =  function (event) {
      // event.preventDefault();
      setFocusTab('home');
      navigate('/', {state: {}, replace: false});
    }

    const navigateAboutUs = function (event) {
      // event.preventDefault();
      setFocusTab('aboutUs');
      navigate('/AboutUs', {state: {}, replace: false});
    }

    const toggle = function () {
        var now = showMenu;
        setShowMenu(!now);
    }

    const handleLogout = async function (event) {
      event.preventDefault();
      try{
        setLoading(true);
        await logout();
        navigate('/login', {state: {}, replace: false});
      }
      catch{
        alert('failed to Logout');
      }
      setLoading(false);
    }

    return (
          <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light container-fluid">
            <a className="navbar-brand" href="./index.html">
              <img src={logo} width="50" height="50" className="navbar-image d-inline-block align-middle" alt=""/>
              <span className="navBarTitle">Placements, NIT Calicut</span>
            </a>
            <button className="navbar-toggler ms-auto" type="button" onClick={() => {
              toggle();
            }}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={"collapse navbar-collapse " + (showMenu ? "show": "")} id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className='nav-item'>
                  <a className={'nav-link' + (focusTab === 'home' ? ' active': '')} onClick={(e) => {navigateHome(e)}}>
                    {focusTab === 'home' && <FontAwesomeIcon icon={faHome} />} Home</a>
                </li>
                <li className='nav-item'>
                  <a className={'nav-link' + (focusTab === 'aboutUs' ? ' active': '')} onClick={(e)=> {navigateAboutUs(e)}}>
                    {focusTab === "aboutUs" && <FontAwesomeIcon icon={faPeopleGroup} /> }
                    About Us</a>
                </li>

                <li className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle user" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faCircleUser} />
                    </button>
                    <ul className="dropdown-menu user-dropdown dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/userInfo">User Profile</Link></li>
                      <li><a className="dropdown-item" onClick={(e) => {
                        handleLogout(e);
                      }}>Logout</a></li>
                    </ul>
                  </li>
              </ul>
            </div>
          </nav>
        
    );
    
}