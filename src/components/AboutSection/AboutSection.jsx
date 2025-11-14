import React from 'react';
import './AboutSection.css';
// variable for my main pic
import MainPic from '../../assets/images/MainPic.jpg';

function AboutSection() {
    return(
        <section className="who-we-are-container" id='About'>
        <h2 className="section-title">Who We Are</h2>
        
        <div className="content-block">
            <div className="image-wrapper">
                <img src={MainPic} alt="Mechanic holding a wrench and smiling" className="mechanic-image" />
            </div>

            <p className="intro-text-box">
                We aren't just a business; we're a family. **Otterly Reliable** was founded by the 
                Johnson family with a simple goal: to bring honest, neighborly service back to auto repair. 
                For us, every customer is an extension of our community, and we treat your vehicle with 
                the same care we give our own. Being family-owned means we stand behind every job, 
                ensuring that our reputation for Otterly Reliable service is earned one great repair at a time.
            </p>
        </div>
    </section>
    );
}

export default AboutSection;