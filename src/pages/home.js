import React from "react";
import Footer from '../components/footer.js';
import Carousel from 'react-bootstrap/Carousel';
import image1 from '../assets/image6.jpg';
import image2 from '../assets/image5.jpg';
import image3 from '../assets/image4.jpg';
import '../styles/home.css';
import { useAuth } from "../context/AuthContext.js";


export default function Home() {
    const { currentUser } = useAuth();
    console.log(currentUser);
    return (
        <>
        {/* <div>
            <center>
            <h1>Home</h1>
            </center>
        </div> */}

<div className='homeCarousel'>
<Carousel>
      <Carousel.Item>
        <img
          className="d-block"
          src={image1}
          alt="First slide"
        />
        <Carousel.Caption>
          <h1>NITC Placement Management Portal</h1>
          <p>In recruiting, there are no good or bad experiences - just learning experiences!!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block"
          src={image2}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h1>NITC Placement Management Portal</h1>
          <p>Chase your dreams !!. Success doesn't come to you, you go to it.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block"
          src={image3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h1>NITC Placement Management Portal</h1>
          <p>A one stop portal for placements!!</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
 
</div>

      <center>
        
      </center>
       <Footer/>
        </>
    );
}