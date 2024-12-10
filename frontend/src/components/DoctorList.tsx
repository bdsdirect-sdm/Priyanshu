import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/DoctorList.css';

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc' as 'asc' | 'desc',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDoctor = async () => {
    try {
      const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      toast.error(`Error fetching doctor data: ${err}`);
    }
  };

  const { data: doctors, error, isLoading, isError } = useQuery({
    queryKey: ['doctor'],
    queryFn: fetchDoctor,
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({
      key,
      direction,
    });
  };

  const sortedDoctors = React.useMemo(() => {
    if (!doctors?.doctorList) return [];
    let sortedData = [...doctors.doctorList];

    if (sortConfig.key) {
      sortedData = sortedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedData;
  }, [doctors?.doctorList, sortConfig]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <div className="text-danger">Error: {error.message}</div>
      </div>
    );
  }

  console.log('Doctor List------------>', doctors);

  return (
    <div className="doctor-list-container">
      <h2 className="doctor-list-title">Doctors List</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort('firstname')}>
                Doctor name
                {sortConfig.key === 'firstname' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th scope="col" onClick={() => handleSort('referralPlaced')}>
                Referral placed
                {sortConfig.key === 'referralPlaced' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th scope="col" onClick={() => handleSort('referralCompleted')}>
                Referral completed
                {sortConfig.key === 'referralCompleted' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th scope="col" onClick={() => handleSort('avgContactTime')}>
                Avg time of contact
                {sortConfig.key === 'avgContactTime' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th scope="col" onClick={() => handleSort('avgConsultTime')}>
                Avg time of consult
                {sortConfig.key === 'avgConsultTime' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th scope="col" onClick={() => handleSort('phone')}>
                Phone
                {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
              <th scope="col" onClick={() => handleSort('email')}>
                Email
                {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDoctors?.map((doctor: any, index: number) => (
              <tr key={doctor.id}>
                <td>{doctor.firstname} {doctor.lastname}</td>
                <td>{doctor.referralPlaced || '-'}</td>
                <td>{doctor.referralCompleted || '-'}</td>
                <td>{doctor.avgContactTime || '-'}</td>
                <td>{doctor.avgConsultTime || '-'}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorList;
