import React from 'react';
import './Card.css';

function Card({ iconPath, title, description }) {
    return(
        <div className="service-card">
            
            <div className="card-icon-area">
                <img src={iconPath} alt={`${title} icon`} className="service-icon" /> 
            </div>

            {/* Title and Description */}
            <div className="card-text-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
            </div>

        </div>
    );}

export default Card;