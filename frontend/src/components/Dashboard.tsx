import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const getUser = async () => {
        try {
            const response = await api.get(`${Local.GET_USER}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (err) {
            toast.error("Failed to fetch user data");
        }
    };

    const fetchPatientList = async () => {
        try {
            const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("HUHU", response);
            return response.data || '';
        } catch (err) {
            toast.error("Failed to fetch patient data");
        }
    };

    const fetchDoctorList = async () => {
        try {
            const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            toast.error("Failed to fetch doctor data");
        }
    };

    const { data: userData, isError: userError, error: userErrorMsg } = useQuery({
        queryKey: ['userData', token],
        queryFn: getUser
    });

    const { data: patientData, isError: patientError, error: patientErrorMsg } = useQuery({
        queryKey: ['patientData'],
        queryFn: fetchPatientList
    });

    const { data: doctorData, isError: doctorError, error: doctorErrorMsg } = useQuery({
        queryKey: ['doctorData'],
        queryFn: fetchDoctorList
    });

    if (userError || patientError || doctorError) {
        return (
            <div className="error-container">
                <div>Error: {userErrorMsg?.message || patientErrorMsg?.message || doctorErrorMsg?.message}</div>
            </div>
        );
    }

    const user = userData?.data?.user || {};

    const { patientList } = patientData || {};
    const { doctorList } = doctorData || {};

    localStorage.setItem("firstname", user.firstname || "");
    localStorage.setItem("lastname", user.lastname || "");

    const totalRefersReceived = patientList?.length || 0;
    const totalRefersCompleted = patientList?.filter((patient: { referalstatus: boolean }) => patient.referalstatus === true).length || 0;
    const totalDoctors = doctorList?.length || 0;

    const paginatedPatients = patientList?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];

    const totalPages = Math.ceil(totalRefersReceived / pageSize);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard</h2>

            <div className="metrics-cards">
                <div className="card" onClick={() => navigate('/patient')}>
                    <div className="card-body">Referrals Placed
                        <div className='icon d-flex'>
                            <img src="5be148eb11e3f4de1fe4.svg" alt="EyeRefer" className='icon-2' />
                            <div className="card-text">{totalRefersReceived}</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body" onClick={() => navigate('/patient')}>Referrals Completed
                        <div className='icon d-flex'>
                            <img src="77540cee2e45a0c333cd.svg" alt="EyeRefer" className='icon-2' />
                            <div className="card-text">{totalRefersCompleted}</div>
                        </div>
                    </div>
                </div>

                <div className="card" onClick={() => navigate('/doctor')}>
                    <div className="card-body">MD
                        <div className='icon d-flex'>
                            <img src="0685f1c668f1deb33e75.png" alt="EyeRefer" className='icon-2' />
                            <div className="card-text">{totalDoctors}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='refer d-flex'>
                {user.doctype === 2 ? (<><h2 className="refer-title">Referrals Placed</h2><button className="appointment-btn" onClick={() => navigate("/add-patient")}>+Add Referral patient</button></>) : <><h2 className="refer-title">Add Appointment</h2><button className="appointment-btn" onClick={() => navigate("/add-appointment")}>+Add Appointment</button></>}
            </div>

            <div className="patient-list-section">
                <div className="patient-table-container">
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
                            {paginatedPatients?.map((patient: any, index: number) => (
                                <tr key={index}>
                                    <td>{patient?.firstname} {patient?.lastname}</td>
                                    <td>{patient?.disease}</td>
                                    <td>{patient?.referedby.firstname} {patient?.referedby?.lastname}</td>
                                    <td>{patient?.referedto.firstname} {patient?.referedto?.lastname}</td>
                                    <td>{patient?.referback ? 'Yes' : 'No'}</td>
                                    <td>
                                        <span className="status-color">{patient?.referalstatus ? 'Completed' : 'Pending'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="pagination-container">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                <div className='counting'>{` ${currentPage} / ${totalPages}`}</div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}

                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
