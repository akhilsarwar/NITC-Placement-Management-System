import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import { faSquareGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer () {
    return (
        <div className="footerDiv">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 px-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-muted">Team 3: Web Programming</span>
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">  
            <li className="ms-3 mb-md-0 footerItem"><a href="./members.html"><FontAwesomeIcon icon={faPeopleGroup} /></a></li>
            <li className="ms-3 mb-md-0 footerItem"><a href="./contacts.html"><FontAwesomeIcon icon={faAddressCard} /></a></li>
            <li className="ms-3 mb-md-0 footerItem">
                <a href="https://github.com/TomSaju2001/NITC-PlacementManagementSystem">
                <FontAwesomeIcon icon={ faSquareGithub } />
                </a>
            </li>
            </ul>
        </footer>
        </div>
    );
}