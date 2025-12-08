// src/components/Testimonials/Testimonials.jsx
import React, { useRef } from 'react'; // useRef is kept as it might be used internally by the carousel
import './Testimonials.css';
import '../AboutSection/AboutSection.css'; // For section-title class

// Import images for testimonials 
import samWise from '../../assets/images/Testimonials1.jpg';
import daveMill from '../../assets/images/Testimonials2.jpg';
import gwenSanta from '../../assets/images/Testimonials3.jpg';


const TESTIMONIAL_DATA = [
  { id: 1, image: samWise, name: 'Sam Wise', rating: 5, text: 'I brought my truck in for a transmission issue and they had it diagnosed and fixed within two days. The staff was professional, kept me updated throughout the process, and the pricing was fair. Highly recommend!' },
  { id: 2, image: daveMill, name: 'Dave Mill', rating: 5, text: 'These guys saved me when my engine started making strange noises. They explained everything clearly, showed me what was wrong, and got me back on the road quickly. Great service and honest mechanics.' },
  { id: 3, image: gwenSanta, name: 'Gwen Santa', rating: 5, text: 'I\'ve been coming here for years for all my car maintenance needs. They always do quality work, never try to upsell unnecessary services, and treat my vehicle with care. Trustworthy and reliable!' },
  { id: 4, image: samWise, name: 'Sam Wise', rating: 5, text: 'After my brake pads started squealing, I brought my car in for an inspection. They fixed the issue promptly and even noticed a few other things that needed attention. Very thorough and professional service.' },
  { id: 5, image: daveMill, name: 'Dave Mill', rating: 5, text: 'I had an emergency repair needed before a long road trip. They squeezed me in, got the work done same day, and made sure everything was safe for travel. Excellent customer service and quality workmanship!' },
];

const renderRating = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>
        ★
      </span>
    );
  }
  return <div className="testimonial-rating">{stars}</div>;
};

const Testimonials = () => {
  // Logic (useRef, scrollCarousel) is removed or unused now

  return (
    <section className="testimonials-section-container">
      <h2 className="section-title">Testimonials</h2>
      
      
      <div className="horizontal-scroll-wrapper">
          <div 
              className="testimonials-carousel"
              /* REMOVED: ref={carouselRef} */
          >
              {TESTIMONIAL_DATA.map((item) => (
                  <div key={item.id} className="testimonial-card-wrapper">
                      
                      {/* Image Area */}
                      <div className="testimonial-image-area">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="testimonial-image" 
                        />
                      </div>
                      
                      {/* Text Content */}
                      <div className="testimonial-content">
                        <h3 className="testimonial-name">From {item.name}</h3>
                        {renderRating(item.rating)}
                        <p className="testimonial-text">
                          {item.text}
                        </p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
      
    </section>
  );
};

export default Testimonials;