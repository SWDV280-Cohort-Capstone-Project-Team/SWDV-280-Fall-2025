// src/components/Testimonials/Testimonials.jsx
import React, { useRef } from 'react'; // useRef is kept as it might be used internally by the carousel
import './Testimonials.css';

// Import images for testimonials 
import samWise from '../../assets/images/Testimonials1.jpg';
import daveMill from '../../assets/images/Testimonials2.jpg';
import gwenSanta from '../../assets/images/Testimonials3.jpg';


const TESTIMONIAL_DATA = [
  // ... (Your TESTIMONIAL_DATA array) ...
  { id: 1, image: samWise, name: 'Sam Wise', rating: 5, text: "I won't go anywhere else! The team at Otterly Reliable diagnosed my complex electrical issue when three other shops couldn't. Technical expertise is top-notch, and the repair was done perfectly" },
  { id: 2, image: daveMill, name: 'Dave Mill', rating: 5, text: "The service was incredibly fast. I was expecting to leave my car all day for an oil change and tire rotation, but they got me in and out in less than an hour. Truly reliable and efficient!" },
  { id: 3, image: gwenSanta, name: 'Gwen Santa', rating: 5, text: "Genuinely great customer service. They showed me exactly what was wrong with my brakes and gave me a fair quote with zero pressure. Their honesty builds trust. 5 stars all the way." },
  { id: 4, image: samWise, name: 'Sam Wise', rating: 5, text: "I used their pre-purchase inspection service, and it saved me thousands by flagging hidden transmission issues. The report was detailed and thorough. They stand behind their work." },
  { id: 5, image: daveMill, name: 'Dave Mill', rating: 5, text:"Fantastic experience from booking the appointment to picking up the car. They kept me updated via text and even washed my car! Above and beyond service every time. iam for sure caming back" },
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