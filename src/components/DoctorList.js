// components/DoctorList.js
import React from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';

function DoctorList({ doctors }) {
  if (doctors.length === 0) {
    return <div className="no-results">No doctors found matching your criteria</div>;
  }

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

export default DoctorList;