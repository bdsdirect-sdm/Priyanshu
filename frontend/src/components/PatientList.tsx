import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/PatientList.css';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const doctype = localStorage.getItem('doctype'); // Retrieve doctype from local storage
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  const { data: Patients, error, isLoading, isError } = useQuery({
    queryKey: ['patient'],
    queryFn: fetchPatient,
  });

  const handleSearch = () => {
    if (Patients?.patientList) {
      setFilteredPatients(
        Patients.patientList.filter((patient: any) =>
          `${patient.firstname} ${patient.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
      setCurrentPage(1); // Reset to the first page on new search
    }
  };

  useEffect(() => {
    if (Patients?.patientList && searchQuery === '') {
      setFilteredPatients(Patients.patientList);
    }
  }, [searchQuery, Patients]);

  if (isLoading) {
    return (
      <>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="text-danger">Error: {error.message}</div>
      </>
    );
  }

  console.log('Patient-List------------>', Patients);

  // Pagination logic
  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddPatient = () => {
    navigate('/add-patient');
  };

  return (
    <div className="patient-list-container">
      <div className="header-container-patientlist">
        <p className="heading-patient">Referred Patients</p>

        {/* Conditionally render the button based on doctype */}
        {doctype === '2' && (
          <button className="add-patient-button" onClick={handleAddPatient}>
            Refer Patient
          </button>
        )}
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Patient Name</th>
            <th scope="col">Disease</th>
            <th scope="col">Refer by</th>
            <th scope="col">Refer to</th>
            <th scope="col">Refer back</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPatients.map((patient: any, index: number) => (
            <tr key={index}>
              <td>{patient.firstname} {patient.lastname}</td>
              <td>{patient.disease}</td>
              <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
              <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
              <td>{patient.referback ? 'Yes' : 'No'}</td>
              <td>{patient.referalstatus ? 'Completed' : 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination-container">
        <button
          className="page-nav"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="page-nav"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PatientList;
