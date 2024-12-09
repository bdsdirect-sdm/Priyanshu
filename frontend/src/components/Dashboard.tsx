import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;
    const directChat = (patient: any, user1: any, user2: any, user: any, firstname: any, lastname: any) => {
        const chatdata = {
            patient: patient,
            user1: user1,
            user2: user2,
            user: user,
            roomname: `${firstname} ${lastname}`
        };
        localStorage.setItem("pname", chatdata.roomname);
        localStorage.setItem('chatdata', JSON.stringify(chatdata));
        navigate('/chat')
        return;
    }
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
            // console.log("HUHU", response);
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
                    <div className="card-body">Doctor OD/MD
                        <div className='icon d-flex'>
                            <img src="0685f1c668f1deb33e75.png" alt="EyeRefer" className='icon-2' />
                            <div className="card-text">{totalDoctors}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='refer d-flex'>
                {user.doctype === 2 ? (<><h2 className="refer-title">Referral Patient</h2><button className="appointment-btn" onClick={() => navigate("/add-patient")}>+Add Referral patient</button></>) : <><h2 className="refer-title">Add Appointment</h2><button className="appointment-btn" onClick={() => navigate("/add-appointment")}>+Add Appointment</button></>}
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
                                <th scope="col">Direct Message</th>
                                <th scope="col">Action</th>
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
                                    <td> <p className='text-primary text-decoration-underline chng-pointer' onClick={() => {
                                        directChat(patient.uuid, patient.referedby.uuid, patient.referedto.uuid, patientData?.user.uuid, patient.firstname, patient.lastname);
                                    }} >Link</p> </td>
                                    <td>
                                        <div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-eye text-success"
                                                viewBox="0 0 16 16"
                                                onClick={() => {
                                                    localStorage.setItem("patientId", patient.uuid);
                                                    navigate('/view-patient');
                                                }}
                                            >
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="pagination-container">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default Dashboard;
