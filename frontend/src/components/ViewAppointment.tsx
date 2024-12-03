import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import api from '../api/axiosInstance';
import '../styles/ViewAppointment.css';

const ViewAppointment: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const appointmentUUID = localStorage.getItem('appointmentId');

  useEffect(() => {
    if (!token || !appointmentUUID) {
      navigate('/login');
    }

    return () => {
      localStorage.removeItem('appointmentId');
      navigate('/appointments');
    };
  }, []);

  const getAppointment = async () => {
    try {
      const response = await api.get(`${Local.VIEW_APPOINTMENT}/${appointmentUUID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      console.log(err.response.data.message);
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['appointment'],
    queryFn: getAppointment,
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-message">Loading...</div>
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-message">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <h1 className="appointment-title">Appointment Details</h1>
      <div className="appointment-card">
        <div className="appointment-card-body">
          <h5 className="appointment-detail-title">
            Patient Name: {data.appointment.pid.firstname} {data.appointment.pid.lastname}
          </h5>
        </div>

        <div className="appointment-card-body">
          <h5 className="appointment-detail-title">
            Appointment Date: <span>{new Date(data.appointment.appointmentDate)?.toLocaleDateString()}</span>
          </h5>
        </div>

        <div className="appointment-card-body">
          <h5 className="appointment-detail-title">
            Appointment Type: {data.appointment.type}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointment;
