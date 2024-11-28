import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import "../styles/AppointmentList.css"
import PatientList from './PatientList';

interface Appointment {
    uuid: string;
    patientName: string;
    appointmentDate: string;
    type: 'Consultant' | 'Surgery';
}

const AppointmentList: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [patientId, setPatientId] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const endpoint = patientId
                    ? `${Local.GET_APPOINTMENT_LIST}?patientId=${patientId}`
                    : `${Local.GET_APPOINTMENT_LIST}`;
                const response = await api.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setAppointments(response.data.appointments);
                setIsLoading(false);
            } catch (err) {
                setIsError(true);
                toast.error('Failed to fetch appointments: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        };

        fetchAppointments();
    }, [patientId]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPatientId(event.target.value || null);
    };

    const handleAddAppointmentClick = () => {
        navigate('/add-appointment');
    };

    if (isLoading) {
        return (
            <div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-danger">
                Error: Failed to load appointments.
            </div>
        );
    }

    return (
        <div className="appointments-list-container">
            <div className="appointments-header d-flex justify-content-between align-items-center">
                <h2 className="form-title">Appointments List</h2>

                <button
                    className="appointment-btn"
                    onClick={handleAddAppointmentClick}
                >
                    Add Appointment
                </button>
            </div>

            {/* <div className="mb-3">
                <label htmlFor="patientFilter" className="form-label">Filter by Patient ID</label>
                <input
                    id="patientFilter"
                    type="text"
                    className="form-control"
                    value={patientId || ''}
                    onChange={handleFilterChange}
                    placeholder="Enter Patient ID to filter"
                />
            </div> */}

            <table className="table">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Appointment Date</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.uuid}>
                            <td>{appointment.patientName}</td>
                            <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                            <td>{appointment.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentList;
