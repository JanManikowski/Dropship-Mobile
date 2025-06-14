import React from 'react';
import Navbar from '../components/Navbar';
import testImage from '../assets/images/test.jpg';
import mainImage from '../assets/images/169main.jpg';
import BestSellerSlider from '../components/BestSellerSlider';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const features = [
    { icon: testImage, title: "Gepersonaliseerd" },
    { icon: testImage, title: "Handgemaakt met Liefde" },
    { icon: testImage, title: "Het Perfecte Cadeau" },
    { icon: testImage, title: "Waterproof" },
  ];

  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="position-relative w-100" style={{ aspectRatio: '16 / 9',  }}>
        <img
  src={mainImage}
  alt="Couple"
  className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
  style={{ objectFit: 'cover', zIndex: 2 }}
/>

        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-center align-items-center text-center px-4"
          style={{ pointerEvents: 'none' }}
        >
          <h1 className="text-white fw-bold mb-4" style={{ fontSize: '2rem' }}>
            Cadeaus die onvergetelijke momenten creëren
          </h1>
          <button className="btn btn-danger px-4 py-2 fw-semibold rounded-pill">
            SHOP BESTSELLERS
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 text-center bg-white">
        <h2 className="h5 fw-bold mb-4">Wat Ons Speciaal Maakt</h2>
        <div className="row row-cols-2 g-4 px-4">
          {features.map(({ icon, title }) => (
            <div key={title} className="col d-flex flex-column align-items-center">
              <img src={icon} alt={title} className="mb-2" style={{ width: '40px', height: '40px' }} />
              <p className="small mb-0">{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Preview */}
          <BestSellerSlider />

    </div>
  );
};

export default Homepage;
