import React, { useState } from "react";
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import { Modal, Button } from "react-bootstrap";
import tom_cv from '../assets/tom_cv.pdf';
import akhil_cv from '../assets/akhil_cv.pdf';
import nishant_cv from '../assets/nishant_cv.pdf';
import abbad_cv from '../assets/abbad_cv.pdf';
import '../styles/aboutUs.css';

export default function AboutUs(){

    const cvName = {"Akhil Sarwar T H": akhil_cv, "Tom Saju": tom_cv, "Abbad Maliyekkal": abbad_cv, "Nishant Kumar Bhardwaj": nishant_cv};

    const [cvNow, setCvNow] = useState(akhil_cv);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (event) => {
        var elemId = event.target.id;
        // console.log(elemId)
        setCvNow(cvName[elemId]);
        setShow(true)
    };
    
    return (
        <>
        {/* <Navbar/> */}


        <div className="container-fluid">
            <div className="row">
            <div className="title-text-div col-lg-12 titleSection">
                <center>
                    <h1>About Us</h1>
                    <div>
                        Welcome to the Official Placement Portal of NITC .A focus on excellence in research and career developing skills, the academic freedom it offers, coupled with a beautiful campus and a salubrious climate has meant that NITC is the most sought after destination for top and young minds.
                    </div>

                    <div>
                        This portal
                        aims to bring more advancements like checking the
                        student ability for a particular and how much he/she has to
                        prepare to reach that company’s expectations based on the
                        requirements that are mentioned by the company
                    </div>
                </center>
            <div className="title-img-div col-lg-6">
                <img className="title-img" src="images/title-image.png" alt=""/>
            </div>
            </div>
          </div>
        </div>


      <div className="membersTitle">
        <h2>Our Team</h2>
      </div>
    
      <div className="container-fluid membersTable">
        <table className="table table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Roll No</th>
              <th scope="col">CV</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Akhil Sarwar T H</td>
              <td>B190486CS</td>
              <td><button id="Akhil Sarwar T H" type="button" className="btn btn-primary openDialogButton" onClick={(e) => {handleShow(e)}}>
                  Open CV
                </button></td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Tom Saju</td>
              <td>B191290CS</td>
              <td><button id="Tom Saju" type="button" className="btn btn-primary openDialogButton" onClick={(e) => {handleShow(e)}}>
                  Open CV
                </button></td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Nishant Kumar Bhardwaj</td>
              <td>B190427CS</td>
              <td><button id="Nishant Kumar Bhardwaj" type="button" className="btn btn-primary openDialogButton" onClick={(e) => {handleShow(e)}}>
                  Open CV
                </button></td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Abbad Maliyekkal</td>
              <td>B190372CS</td>
              <td><button id="Abbad Maliyekkal" type="button" className="btn btn-primary openDialogButton" onClick={(e) => {handleShow(e)}}>
                  Open CV
                </button></td>
            </tr>
          </tbody>
        </table>
      </div>



      <Modal show={show} onHide={handleClose} dialogClassName="modal-width">
        <Modal.Header closeButton>
          <Modal.Title>CV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* <Document file={cvNow}>
        <Page pageNumber={1} />
      </Document> */}
      <object width="100%" height="600px" data={cvNow} type="application/pdf">   </object>
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    <div className="contactTitle">
        <h2>Contact Us</h2>
    </div>

    <div className="container-fluid membersTable">
        <table className="table table-striped text-center">
        <thead className="table-dark">
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Roll No</th>
            <th scope="col">Email & Phone No</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <th scope="row">1</th>
            <td>Akhil Sarwar T H</td>
            <td>B190486CS</td>
            <td>
                <a href="mailto:akhil_b190486cs@nitc.ac.in" target="_blank">akhil_b190486cs@nitc.ac.in</a>
                <a href="tel: +91 83308559922" target="_blank"><br/>+91 83308559922</a>
            </td>
            </tr>
            <tr>
            <th scope="row">2</th>
            <td>Tom Saju</td>
            <td>B191290CS</td>
            <td>
                <a href="mailto:tom_b191290cs@nitc.ac.in" target="_blank">tom_b191290cs@nitc.ac.in</a>
                <a href="tel: +91 9188506775" target="_blank"><br/>+91 9188506775</a>
            </td>
            </tr>
            <tr>
            <th scope="row">3</th>
            <td>Nishant Kumar Bhardwaj</td>
            <td>B190427CS</td>
            <td>
                <a href="mailto:nishant_b190427cs@nitc.ac.in" target="_blank">nishant_b190427cs@nitc.ac.in</a>
                <a href="tel: +91 7594944562" target="_blank"><br/>+91 7594944562</a>
            </td>
            </tr>
            <tr>
            <th scope="row">4</th>
            <td>Abbad Maliyekkal</td>
            <td>B190372CS</td>
            <td><a href="mailto:abbad_b190372cs@nitc.ac.in" target="_blank">abbad_b190372cs@nitc.ac.in</a>
                <a href="tel: +91 8943992992" target="_blank"><br/>+91 8943992992</a>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
        <Footer/>
        </>
    );
}