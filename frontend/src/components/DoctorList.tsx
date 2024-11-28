import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/DoctorList.css';

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
      <h2 className="doctor-list-title">Doctor List</h2>
      <div className="table-container">
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">Doctor name</th>
              <th scope="col">Referal placed</th>
              <th scope="col">Referal completed</th>
              <th scope="col">Avg time of contact</th>
              <th scope="col">Avg time of consult</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {doctors?.doctorList?.map((doctor: any, index: number) => (
              <tr key={doctor.id}>
                <td>{doctor.firstname} {doctor.lastname}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
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
