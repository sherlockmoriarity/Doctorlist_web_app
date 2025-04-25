// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import DoctorList from './components/DoctorList';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function MainContent() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const query = useQuery();

  // Helper to extract numeric value from experience string
  const extractExperienceYears = (expString) => {
    if (!expString) return 0;
    const match = expString.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Helper to extract numeric value from fees string
  const extractFees = (feesString) => {
    if (!feesString) return 0;
    const match = feesString.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        
        // If the response is a single doctor object, convert to array
        const doctorsData = Array.isArray(response.data) ? response.data : [response.data];
        setDoctors(doctorsData);
        
        // Extract unique specialties from the correct path
        const allSpecialties = doctorsData.flatMap(doctor => 
          doctor.specialities ? doctor.specialities.map(s => s.name) : []
        );
        const uniqueSpecialties = [...new Set(allSpecialties)].filter(Boolean);
        console.log('Unique specialties:', uniqueSpecialties);
        setSpecialties(uniqueSpecialties);
        
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch doctors data');
        setLoading(false);
      }
    };
  
    fetchDoctors();
  }, []);

  // Parse URL params on initial load
  useEffect(() => {
    const search = query.get('search') || '';
    const consult = query.get('consultationType') || '';
    const specs = query.get('specialties') ? query.get('specialties').split(',') : [];
    const sort = query.get('sortBy') || '';

    setSearchTerm(search);
    setConsultationType(consult);
    setSelectedSpecialties(specs);
    setSortBy(sort);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('search', searchTerm);
    if (consultationType) params.append('consultationType', consultationType);
    if (selectedSpecialties.length > 0) params.append('specialties', selectedSpecialties.join(','));
    if (sortBy) params.append('sortBy', sortBy);
    
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchTerm, consultationType, selectedSpecialties, sortBy, navigate]);

  // Apply filters and sorting
  useEffect(() => {
    if (!doctors.length) return;

    let result = [...doctors];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(doctor => 
        doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by consultation type
    if (consultationType) {
      result = result.filter(doctor => {
        if (consultationType === 'Video Consult') return doctor.video_consult === true;
        if (consultationType === 'In Clinic') return doctor.in_clinic === true;
        return true;
      });
    }
    
    // Filter by specialties
    if (selectedSpecialties.length > 0) {
      result = result.filter(doctor => {
        // Get array of specialty names from the doctor
        const doctorSpecialtyNames = doctor.specialities ? 
          doctor.specialities.map(s => s.name) : [];
        
        // Check if any selected specialty is in the doctor's specialties
        return selectedSpecialties.some(specialty => 
          doctorSpecialtyNames.includes(specialty)
        );
      });
    }
    
    // Apply sorting
    if (sortBy === 'fees') {
      result.sort((a, b) => extractFees(a.fees) - extractFees(b.fees));
    } else if (sortBy === 'experience') {
      result.sort((a, b) => extractExperienceYears(b.experience) - extractExperienceYears(a.experience));
    }
    
    setFilteredDoctors(result);
  }, [doctors, searchTerm, consultationType, selectedSpecialties, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleConsultationTypeChange = (type) => {
    setConsultationType(type);
  };

  const handleSpecialtyChange = (specialty, isChecked) => {
    if (isChecked) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    } else {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    }
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app-container">
      <Header onSearch={handleSearch} doctors={doctors} searchTerm={searchTerm} />
      <div className="main-content">
        <div className="sidebar">
          <FilterPanel 
            specialties={specialties}
            selectedSpecialties={selectedSpecialties}
            consultationType={consultationType}
            sortBy={sortBy}
            onConsultationTypeChange={handleConsultationTypeChange}
            onSpecialtyChange={handleSpecialtyChange}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="content">
          <DoctorList doctors={filteredDoctors} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
