import React from "react";
import Footer from '../components/footer.js';
import Carousel from 'react-bootstrap/Carousel';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
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
          <h2>NITC Placement Management Portal</h2>
          <p>Chase your dreams !!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block"
          src={image2}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h2>NITC Placement Management Portal</h2>
          <p>Chase your dreams !!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block"
          src={image3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h2>NITC Placement Management Portal</h2>
          <p>Chase your dreams !!</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
 
</div>
       <Footer/>
        </>
    );
}