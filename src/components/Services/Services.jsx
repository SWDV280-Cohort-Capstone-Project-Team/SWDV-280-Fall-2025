import React from 'react';
import Card from '../Card/Card'; //  the reusable Card template
import './Services.css'; //  holds the CSS Grid rules

import BreakdownIcon from '../../assets/Icons/breakdown 1.svg';
import CarPartsIcon from '../../assets/Icons/car-parts 1.svg';
import FourWheelIcon from '../../assets/Icons/four-wheel-drive 1.svg';
import EngineIcon from '../../assets/Icons/engine 1.svg';
import HeaterIcon from '../../assets/Icons/heater.svg';
import GearShiftIcon from '../../assets/Icons/gear-shift 1.svg';

// Icon used for Card 1 and Card 7
import ChecklistIcon from '../../assets/Icons/checklist.svg'; 


// 2. DATA FOR 8 SERVICE CARDS (4x2 Grid)
const serviceData = [
  { 
    id: 1, 
    // Uses ChecklistIcon
    icon: ChecklistIcon, 
    title: 'The Full-Service Refresh', 
    description: 'Comprehensive oil and filter change, including multi-point inspection, fluid top-offs, and tire pressure check. Your vehicles routine wellness visit.' 
  },
  { 
    id: 2, 
    icon: BreakdownIcon, 
    title: 'Guardian Stop System Check', 
    description: 'Full brake, tire, and fluid check, pads, rotors, and fluid flush. We ensure your vehicle has the stopping power needed for any road condition.' 
  },
  { 
    id: 3, 
    icon: CarPartsIcon, 
    title: 'Ignition & Power Tune-Up', 
    description: 'Spark plug replacement, ignition system check, and air/fuel mixture adjustments to optimize performance and improve fuel efficiency.' 
  },
  { 
    id: 4, 
    icon: FourWheelIcon, 
    title: 'The Road-Ready Alignment', 
    description: 'Precision four-wheel alignment using laser technology to fix steering issues, prevent uneven tire wear, and optimize handling and vehicle tire rotation.' 
  },
  { 
    id: 5, 
    icon: EngineIcon, 
    title: 'Check Engine Light Decipher', 
    description: 'Advanced computer diagnostics, code analysis, and pinpointing the root cause of issues indicated by your dashboard warnings.' 
  },
  { 
    id: 6, 
    icon: HeaterIcon, 
    title: 'Climate Comfort Overhaul', 
    description: 'Full inspection and recharge of the AC and heating system, including compressor health, coolant levels, and component replacement to ensure temperature accuracy.' 
  },
  { 
    id: 7, 
    //  ChecklistIcon 
    icon: ChecklistIcon, 
    title: 'Pre-Purchase Peace of Mind', 
    description: 'A comprehensive multi-point inspection for prospective buyers, covering engine health, frame integrity, and condition of a used vehicle before purchase.' 
  },
  { 
    id: 8, 
    icon: GearShiftIcon, 
    title: 'Smooth Shift Service', 
    description: 'Transmission fluid and filter replacement (for both automatic and manual) and inspection of drivetrain components to ensure your vehicle transmits seamless gear shifts.' 
  },
];

function Services() {
    return (
        <section className="services-section-container">
            <h2 className="section-title">Service We Provide</h2>

            {/*  receives the CSS Grid styles */}
            <div className="card-grid">

              {/* Map iterates over the data and creates 8 Card components */}
            {serviceData.map((item) => (
                <Card 
                    key={item.id}
                    iconPath={item.icon} // Path to the small icon/image
                    title={item.title}
                    description={item.description}
                />
            ))}
            </div>
    </section>
    );
}

export default Services;