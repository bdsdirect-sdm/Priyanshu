import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { queryClient } from '../main';
import api from '../api/axiosInstance';
import "../styles/AppointmentList.css";

const AppointmentList: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const updateAppointmentStatus = async (data: any) => {
        try {
            await api.put(`${Local.EDIT_APPOINTMENT}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem("appointmentUUID");
            queryClient.invalidateQueries({
                queryKey: ["appointments"],
            });
            if (data.status === 3) {
                toast.success("Appointment Completed Successfully");
            } else {
                toast.success("Appointment Cancelled Successfully");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "An error occurred");
        }
    };

    const getAppointments = async () => {
        try {
            const response = await api.get(`${Local.GET_APPOINTMENT_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['appointments'],
        queryFn: getAppointments,
    });

    if (isLoading) {
        return (
            <>
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </>
        );
    }

    if (isError) {
        return <div className="text-danger">Error: {error.message}</div>;
    }

    console.log("Data--->", data);
    return (
        <div className="wrap-content">
            <div className="btn-appointment">
                <h2 className="refer-title">Appointments</h2>
                <button type="button" className="btn-add-appointment" onClick={() => navigate('/add-appointment')}>
                    Add Appointment
                </button>
            </div>
            <br />
            <br />
            <br />
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Patient Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Type</th>
                        <th scope="col">Status</th>
                        <th scope="col">Complete Appointment</th>
                        <th scope="col">Cancel Appointment</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.appointments?.map((appointment: any, index: number) => (
                        <tr key={appointment.uuid}>
                            <td>{appointment?.pid.firstname} {appointment?.pid.lastname}</td>
                            <td>
                                {appointment?.appointmentDate && (
                                    <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                                )}
                            </td>
                            <td>{appointment.type}</td>
                            <td>
                                {appointment?.pid.referalstatus === 1 && "Scheduled"}
                                {appointment?.pid.referalstatus === 2 && "Cancelled"}
                                {appointment?.pid.referalstatus === 3 && "Complete"}
                            </td>
                            <td>
                                {appointment?.pid.referalstatus === 1 && (
                                    <>
                                        <b className="text-success" data-bs-toggle="modal" data-bs-target={`#staticBackdrop-${appointment.uuid}`}>
                                            Complete
                                        </b>

                                        <div
                                            className="modal fade"
                                            id={`staticBackdrop-${appointment.uuid}`}
                                            data-bs-backdrop="static"
                                            data-bs-keyboard="false"
                                            tabIndex={-1}
                                            aria-labelledby="staticBackdropLabel"
                                            aria-hidden="true"
                                        >
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                                            <b>Complete Appointment</b>
                                                        </h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are you sure, you want to complete the appointment with {appointment?.patientId.firstname}?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            data-bs-dismiss="modal"
                                                            onClick={() => updateAppointmentStatus({ referalstatus: 3, appointmentUUID: appointment.uuid })}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {appointment?.pid.referalstatus !== 1 && "-"}
                            </td>

                            <td>
                                {appointment?.pid.referalstatus === 1 && (
                                    <>
                                        <b className="text-danger" data-bs-toggle="modal" data-bs-target={`#staticBackdropCancel-${appointment.uuid}`}>
                                            Cancel
                                        </b>

                                        <div
                                            className="modal fade"
                                            id={`staticBackdropCancel-${appointment.uuid}`}
                                            data-bs-backdrop="static"
                                            data-bs-keyboard="false"
                                            tabIndex={-1}
                                            aria-labelledby="staticBackdropLabel"
                                            aria-hidden="true"
                                        >
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                                            <b>Cancel Appointment</b>
                                                        </h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are you sure, you want to cancel the appointment with {appointment?.patientId.firstname}?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            data-bs-dismiss="modal"
                                                            onClick={() => updateAppointmentStatus({ referalstatus: 2, appointmentUUID: appointment.uuid })}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {appointment?.status !== 1 && "-"}
                            </td>

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
                                            localStorage.setItem("appointmentId", appointment.uuid);
                                            navigate('/view-appointment');
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
    );
};

export default AppointmentList;
