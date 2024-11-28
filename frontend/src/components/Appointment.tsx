import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "../styles/Appointment.css";
import { IoIosArrowBack } from "react-icons/io";
interface Appointment {
    patientName: string;
    appointmentDate: Date;
    type: 'Consultant' | 'Surgery';
}

const AppointmentForm: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState<Appointment>({
        patientName: '',
        appointmentDate: new Date(),
        type: 'Consultant',
    });

    const [minDate, setMinDate] = useState<string>('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchPatients = async () => {
        try {
            const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.patientList;
        } catch (err) {
            toast.error('Error fetching patient data: ' + err);
            throw err;
        }
    };

    const { data: patients, error, isLoading, isError } = useQuery({
        queryKey: ['patients'],
        queryFn: fetchPatients,
    });

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setMinDate(formattedDate);
    }, []);
    const handleCancel = () => {
        // Navigate back to the appointments page or any other relevant page
        navigate('/appointments');
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: name === 'appointmentDate' ? new Date(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.patientName || !formData.appointmentDate || !formData.type) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const appointmentData = {
            patientId: formData.patientName,
            appointmentDate: formData.appointmentDate,
            type: formData.type,
        };

        try {
            const response = await api.post(`${Local.ADD_APPOINTMENT}`, appointmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/appointments');
            }
        } catch (err) {
            toast.error('Failed to create appointment: ' + err);
        }
    };

    if (isLoading) {
        return (
            <div>
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-danger">
                Error: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    return (
        <div className="add-patient-container">
            <h2 className="form-title"><IoIosArrowBack className="icon-back" onClick={handleCancel} />Add Appointment</h2>
            <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-group">
                    <label htmlFor="patientName">Patient Name *</label>
                    <select
                        id="patientName"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="">Select a Patient</option>
                        {patients?.map((patient: any) => (
                            <option key={patient.uuid} value={patient.uuid}>
                                {patient.firstname} {patient.lastname}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appointmentDate">Appointment Date *</label>
                    <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={formData.appointmentDate.toISOString().split('T')[0]}
                        onChange={handleChange}
                        required
                        className="form-control"
                        min={minDate}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Appointment Type *</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="Consultant">Consultant</option>
                        <option value="Surgery">Surgery</option>
                    </select>
                </div>
                <div className='form-action'>
                    <button type="button" className="btn-outline-secondary" onClick={handleCancel}>
                        Cancel
                    </button>

                    <button type="submit" className="btn-submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;
