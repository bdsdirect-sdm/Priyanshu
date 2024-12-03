import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import api from '../api/axiosInstance';

const ViewAppointment: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const appointmentUUID = localStorage.getItem('appointmentId');

  useEffect(() => {
    if (!token || !appointmentUUID) {
      navigate('/login')
    }

    return () => {
      localStorage.removeItem('appointmentId');
      navigate('/appointments');
    }
  }, []);

  const getAppointment = async () => {
    try {
      const response = await api.get(`${Local.VIEW_APPOINTMENT}/${appointmentUUID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data
    }
    catch (err: any) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['appointment'],
    queryFn: getAppointment
  })

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <div>Error: {error.message}</div>
      </>
    )
  }

  // console.log("sdafd", data);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className='mb-4' >Appointment Details</h1>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Patient Name: {data.appointment.patientId.firstname} {data.appointment.patientId.lastname} </h5>
              </div>

              <div className="card-body">
                <h5 className="card-title"> Appointment Date: {data.appointment.date}</h5>
              </div>

              <div className="card-body">
                <h5 className="card-title"> Appointment Type: {data.appointment.type == 1 && ("Surgery")} {data.appointment.type == 2 && ("Consultation")} </h5>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewAppointment