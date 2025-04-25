// components/DoctorCard.js
import React from 'react';
import './DoctorCard.css';

function DoctorCard({ doctor }) {
  // Helper function to safely display any property
  const safeDisplay = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (Array.isArray(value)) return value.map(safeDisplay).join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Handle specialities display safely
  const specialtyDisplay = () => {
    if (!doctor.specialities) return '';
    if (Array.isArray(doctor.specialities)) {
      return doctor.specialities.map(spec => spec.name || safeDisplay(spec)).join(', ');
    }
    return safeDisplay(doctor.specialities);
  };

  // Extract location information from the nested structure
  const getLocationDisplay = () => {
    if (doctor.clinic?.address?.locality && doctor.clinic?.address?.city) {
      return `${doctor.clinic.address.locality}, ${doctor.clinic.address.city}`;
    }
    
    if (doctor.clinic?.address?.address_line1) {
      return doctor.clinic.address.address_line1;
    }
    
    return '';
  };

  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-info">
        <div className="doctor-image">
          <img 
            src={doctor.photo || "/api/placeholder/100/100"} 
            alt={doctor.name || 'Doctor'} 
            onError={(e) => {e.target.src = "/api/placeholder/100/100"}}
          />
        </div>
        <div className="doctor-details">
          <h2 data-testid="doctor-name">{safeDisplay(doctor.name) || 'Unknown Doctor'}</h2>
          <p className="specialty" data-testid="doctor-specialty">{specialtyDisplay()}</p>
          <p className="qualifications">{doctor.doctor_introduction?.split(',')[0] || ''}</p>
          <p className="experience" data-testid="doctor-experience">{safeDisplay(doctor.experience) || ''}</p>
          
          <div className="clinic-info">
            <div className="clinic-icon"></div>
            <span>{doctor.clinic?.name || ''}</span>
          </div>
          
          <div className="location-info">
            <div className="location-icon"></div>
            <span>{getLocationDisplay()}</span>
          </div>
        </div>
      </div>
      <div className="doctor-fee-section">
        <p className="fee" data-testid="doctor-fee">{safeDisplay(doctor.fees) || 0}</p>
        <button className="book-button">Book Appointment</button>
      </div>
    </div>
  );
}

export default DoctorCard;