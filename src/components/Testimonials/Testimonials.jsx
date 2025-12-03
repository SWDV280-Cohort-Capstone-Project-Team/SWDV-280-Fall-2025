// src/components/Testimonials/Testimonials.jsx
import React, { useRef } from 'react'; // useRef is kept as it might be used internally by the carousel
import './Testimonials.css';

// Import images for testimonials 
import samWise from '../../assets/images/Testimonials1.jpg';
import daveMill from '../../assets/images/Testimonials2.jpg';
import gwenSanta from '../../assets/images/Testimonials3.jpg';


const TESTIMONIAL_DATA = [
  // ... (Your TESTIMONIAL_DATA array) ...
  { id: 1, image: samWise, name: 'Sam Wise', rating: 5, text: 'Mauris id purus non odio elementum luctus non quis diam. Cras vitae magna vitae ipsum imperdiet volutpat.' },
  { id: 2, image: daveMill, name: 'Dave Mill', rating: 5, text: 'Nulla vitae diam bibendum, efficitur sem ac, egestas urna. Cras vitae magna vitae ipsum imperdiet volutpat.' },
  { id: 3, image: gwenSanta, name: 'Gwen Santa', rating: 5, text: 'Nulla vitae diam bibendum, efficitur sem ac, egestas urna. Cras vitae magna vitae ipsum imperdiet volutpat.' },
  { id: 4, image: samWise, name: 'Sam Wise', rating: 5, text: 'Mauris id purus non odio elementum luctus non quis diam. Cras vitae magna vitae ipsum imperdiet volutpat.' },
  { id: 5, image: daveMill, name: 'Dave Mill', rating: 5, text: 'Nulla vitae diam bibendum, efficitur sem ac, egestas urna. Cras vitae magna vitae ipsum imperdiet volutpat.' },
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
      <h2>Testimonials</h2>
      
      
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