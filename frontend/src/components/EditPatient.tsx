import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import "../styles/EditPatient.css";
import { FaArrowLeft } from 'react-icons/fa'; // Importing the back button icon


const UpdatePatient: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const patientUUID = localStorage.getItem('patientId');

    useEffect(() => {
        if (!token || !patientUUID) {
            navigate('/login');
        }
        return () => {
            localStorage.removeItem('patientId');
            navigate('/patient');
        };
    }, [navigate, token, patientUUID]);

    const fetchDocs = async () => {
        try {
            const response = await api.get(`${Local.GET_DOC_LIST}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error fetching doctor list');
        }
    };

    const { data: MDList, isLoading: isMDLoading, isError: isMDError, error: MDError } = useQuery({
        queryKey: ["MDList"],
        queryFn: fetchDocs,
    });

    const getPatient = async () => {
        try {
            const response = await api.get(`${Local.VIEW_PATIENT}/${patientUUID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error fetching patient data');
        }
    };

    const { data: Patient, isLoading, isError, error } = useQuery({
        queryKey: ["Patient"],
        queryFn: getPatient,
    });

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required('First Name is required'),
        lastname: Yup.string().required('Last Name is required'),
        disease: Yup.string().required("Disease is required"),
        referedto: Yup.string().required("Select Doctor"),
        address: Yup.string().required("Address is required"),
        referback: Yup.string().required("Please select an option"),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required'),
        gender: Yup.string().required('Gender is required'),
        timing: Yup.string().required('Timing is required'),
        laterality: Yup.string().required('Laterality is required'),
        dob: Yup.date()
            .required('Date of Birth is required')
            .max(new Date(), 'Date of Birth cannot be in the future'),
        diseaseName: Yup.string().required('Disease name is required'),
    });

    const updatePatient = async (data: any) => {
        try {
            await api.put(`${Local.EDIT_PATIENT}/${patientUUID}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Patient updated successfully");
            navigate("/patient");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error updating patient');
        }
    };

    const updateMutation = useMutation({
        mutationFn: updatePatient
    });

    const submitHandler = (values: any) => {
        updateMutation.mutate(values);
    };

    if (isLoading || isMDLoading) {
        return (
            <div className="loading-container">
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError || isMDError) {
        return (
            <div className="error-container">
                <div>Error: {error?.message}</div>
                <div>Error: {MDError?.message}</div>
            </div>
        );
    }

    const referback = Patient.patient.referback ? "1" : "0";

    return (
        <div className="add-patient-container">
            {/* Back Button with icon */}
            <button
                onClick={() => navigate(-1)} // Navigates back to the previous page
                className="back-button">
                <FaArrowLeft size={20} /> {/* Back arrow icon */}
                Back
            </button>
            <h2 className="form-title">Update Patient</h2>
            <Formik
                initialValues={{
                    firstname: Patient.patient.firstname,
                    lastname: Patient.patient.lastname,
                    disease: Patient.patient.disease,
                    referedto: Patient.patient.referedto,
                    address: Patient.patient.address,
                    referback: referback,
                    email: Patient.patient.email,
                    phoneNumber: Patient.patient.phoneNumber,
                    gender: Patient.patient.gender,
                    dob: Patient.patient.dob,
                    diseaseName: Patient.patient.diseaseName,
                    timing: Patient.patient.timing,
                    laterality: Patient.patient.laterality,
                }}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
                enableReinitialize
            >
                {({ values }) => (
                    <Form>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name:</label>
                                <Field type="text" name="firstname" className="form-control" />
                                <ErrorMessage name="firstname" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Last Name:</label>
                                <Field type="text" name="lastname" className="form-control" />
                                <ErrorMessage name="lastname" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Disease:</label>
                                <Field as="select" name="disease" className="form-select">
                                    <option value="" disabled>Choose Disease</option>
                                    {['Cataract', 'Medical', 'Keratoconus', 'Corneal, Non-Keratoconus', 'Other'].map(disease => (
                                        <option key={disease} value={disease}>{disease}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="disease" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Disease Name:</label>
                                <Field type="text" name="diseaseName" className="form-control" />
                                <ErrorMessage name="diseaseName" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Doctor:</label>
                                <Field as="select" name="referedto" className="form-select">
                                    <option value="" disabled>Choose Doctor</option>
                                    {MDList?.docList?.map((md: any) => (
                                        <option key={md.uuid} value={md.uuid}>{md.firstname} {md.lastname}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="referedto" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Address:</label>
                                <Field as="select" name="address" className="form-select">
                                    <option value="" disabled>Choose Address</option>
                                    {values.referedto && MDList.docList.find((md: any) => md.uuid === values.referedto)?.Addresses.map((address: any) => (
                                        <option key={address.uuid} value={address.uuid}>
                                            {address.street} {address.district} {address.city} {address.state}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="address" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Return Back to Referrer:</label>
                                <div>
                                    <label className="me-3">
                                        <Field name="referback" type="radio" value="1" /> Yes
                                    </label>
                                    <label>
                                        <Field name="referback" type="radio" value="0" /> No
                                    </label>
                                    <ErrorMessage name="referback" component="div" className="text-danger" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Date of Birth:</label>
                                <Field type="date" name="dob" className="form-control" />
                                <ErrorMessage name="dob" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <Field type="email" name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Phone Number:</label>
                                <Field type="text" name="phoneNumber" className="form-control" />
                                <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Gender:</label>
                                <Field as="select" name="gender" className="form-select">
                                    <option value="" disabled>Choose Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Field>
                                <ErrorMessage name="gender" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Timing:</label>
                                <Field type="text" name="timing" className="form-control" />
                                <ErrorMessage name="timing" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Laterality:</label>
                                <Field as="select" name="laterality" className="form-select">
                                    <option value="" disabled>Choose Laterality</option>
                                    <option value="Left">Left</option>
                                    <option value="Right">Right</option>
                                    <option value="Bilateral">Bilateral</option>
                                </Field>
                                <ErrorMessage name="laterality" component="div" className="text-danger" />
                            </div>

                            <div className="form-group text-center">
                                <button type="submit" className="btn-outline-primary">Submit</button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdatePatient;
