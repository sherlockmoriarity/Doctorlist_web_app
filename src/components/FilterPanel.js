// components/FilterPanel.js
import React from 'react';
import './FilterPanel.css';

function FilterPanel({ 
  specialties = [], // fallback in case it's undefined
  selectedSpecialties, 
  consultationType, 
  sortBy, 
  onConsultationTypeChange, 
  onSpecialtyChange, 
  onSortChange 
}) {
  return (
    <div className="filter-panel">
      {/* Sort Section */}
      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort by</h3>
        <div className="sort-options">
          <label>
            <input 
              type="radio"
              name="sort"
              checked={sortBy === 'fees'}
              onChange={() => onSortChange('fees')}
              data-testid="sort-fees"
            />
            Price: Low-High
          </label>
          <label>
            <input 
              type="radio"
              name="sort"
              checked={sortBy === 'experience'}
              onChange={() => onSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience: Most Experience first
          </label>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Specialities</h3>
        <div className="specialty-options">
          {specialties
            .filter((specialty) => typeof specialty === 'string')
            .map((specialty) => {
              const safeTestId = `filter-specialty-${specialty
                .replace(/\//g, '-')
                .replace(/\s/g, '-')}`;

              return (
                <label key={specialty}>
                  <input 
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={(e) => onSpecialtyChange(specialty, e.target.checked)}
                    data-testid={safeTestId}
                  />
                  {specialty}
                </label>
              );
            })}
        </div>
      </div>

      {/* Consultation Type Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Mode of consultation</h3>
        <div className="consultation-options">
          <label>
            <input 
              type="radio"
              name="consultation"
              checked={consultationType === 'Video Consult'}
              onChange={() => onConsultationTypeChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consultation
          </label>
          <label>
            <input 
              type="radio"
              name="consultation"
              checked={consultationType === 'In Clinic'}
              onChange={() => onConsultationTypeChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In-clinic Consultation
          </label>
          <label>
            <input 
              type="radio"
              name="consultation"
              checked={consultationType === ''}
              onChange={() => onConsultationTypeChange('')}
            />
            All
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;