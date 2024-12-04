import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import api from '../api/axiosInstance';
import "../styles/Viewpatient.css"; // Import your CSS here

const ViewPatient: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const patientUUID = localStorage.getItem('patientId');

    useEffect(() => {
        if (!token || !patientUUID) {
            navigate('/login')
        }

        return () => {
            localStorage.removeItem('patientId');
        }
    }, [navigate, token, patientUUID])

    const getPatient = async () => {
        try {
            const response = await api.get(`${Local.VIEW_PATIENT}/${patientUUID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data
        }
        catch (err: any) {
            console.log(err.response.data.message);
        }
    }

    const { data: Patient, isLoading, isError, error } = useQuery({
        queryKey: ['Patient'],
        queryFn: getPatient
    })

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-message">Loading...</div>
                <div className="spinner"></div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="error-message">
                Error: {error.message}
            </div>
        )
    }
    return (
        <div className='wrap-content'>
            <h3 className="patient-title">Patient Details</h3>
            <div className="patient-card">
                <div className="patient-card-body">
                    <div className="patient-info">
                        <span className="patient-detail-title">Name: </span>{Patient?.patient.firstname} {Patient?.patient.lastname}
                    </div>
                    <div className="patient-info">
                        <span className="patient-detail-title">Disease: </span>{Patient?.patient.disease}
                    </div>
                    <div className="patient-info">
                        <span className="patient-detail-title">Refer to: </span>{Patient?.referto.firstname} {Patient?.referto.lastname}
                    </div>
                    <div className="patient-info">
                        <span className="patient-detail-title">Refer by: </span>{Patient?.referby.firstname} {Patient?.referby.lastname}
                    </div>
                    <div className="patient-info">
                        <span className="patient-detail-title">Status: </span>{Patient?.referalstatus ? "Yes" : "No"}
                    </div>
                    <div className="patient-info">
                        <span className="patient-detail-title">Back to Referer: </span>{Patient?.referback ? "Yes" : "No"}
                    </div>
                    <div className="patient-info">
                        <span className="patient-detail-title">Address: </span>{Patient?.address.street}, {Patient?.address.district}, {Patient?.address.city}, {Patient?.address.state}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPatient;
