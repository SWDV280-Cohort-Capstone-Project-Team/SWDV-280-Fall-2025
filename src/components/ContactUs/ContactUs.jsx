
import React from 'react';
import './ContactUs.css'; 

export default function ContactUs() {
    return (
        <section className="contact-section-container" id="ContactUS">
            <h2 className="contact-title">Contact Us</h2>
            <div className="contact-form-wrapper">
                <form className="contact-form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" required />
                    </div>    
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" required />
                    </div>    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>    
                    <div className="form-group">
                        <label htmlFor="comments">Additional Comments</label>
                        <textarea id="comments" name="comments" rows="5"></textarea>
                    </div>    
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </section>
    );
}