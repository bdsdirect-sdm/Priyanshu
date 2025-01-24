import React, { useState } from 'react';
// import '../../components/sidebar.css';
import './admin_register.css'; // Import the updated CSS file
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Local from '../../environment/env';
import api from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../../common/components/CommonButton';

const AdminRegister: React.FC = () => {
    const navigate = useNavigate();
    const [pass1type, setPass1Type] = useState('password');
    const [pass1visible, setPass1Visible] = useState(0);
    const [pass2type, setPass2Type] = useState('password');
    const [pass2visible, setPass2Visible] = useState(0);

    // API call to register the admin
    const registerAdmin = async (formData: any) => {
        try {
            console.log("formdataaaaa", formData);
            const response = await api.post(`${Local.CREATE_ADMIN}`, formData); // Replace with your actual API path
            toast.success(response.data.message);
            navigate('/admin/login');
        } catch (err: any) {
            toast.error(`${err.response?.data?.message || "Something went wrong"}`);
            console.error(err);
        }
    };

    // Validation schema for form inputs
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters long")
            .required("Password is required")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/\d/, "Password must contain at least one number")
            .matches(/[\`~!@#$%^&*()?<>|:{}(),.]/, "Password must contain at least one special character"),
        confirmPass: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        firstname: Yup.string().required("First Name is required"),
        lastname: Yup.string().required("Last Name is required"),
    });

    const registerMutation = useMutation({
        mutationFn: registerAdmin,
    });

    // Form submit handler
    const submitHandler = (values: any) => {
        const { confirmPass, ...data } = values; // Remove confirmPass from the payload
        registerMutation.mutate(data);
    };

    return (
        <div className='form-container'>
            <div className='mt-5 mb-5'>
                <h1 className='text-center'>SIGNUP FORM <br />REGISTER</h1>
                <hr className='opacity-100 rounded' />
            </div>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    confirmPass: '',
                    firstname: '',
                    lastname: '',
                }}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
            >
                {() => (
                    <Form>
                        <div className='row mb-3'>
                            <div className='col'>
                                <label className='form-label'>First Name</label>
                                <Field type="text" name="firstname" className="form-control" placeholder="John" />
                                <ErrorMessage name="firstname" component="div" className="text-danger" />
                            </div>
                            <div className='col'>
                                <label className='form-label'>Last Name</label>
                                <Field type="text" name="lastname" className="form-control" placeholder="Doe" />
                                <ErrorMessage name="lastname" component="div" className="text-danger" />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className='col'>
                                <label className='form-label'>Email</label>
                                <Field type="email" name="email" className="form-control" placeholder="admin@example.com" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className='col'>
                                <label className='form-label'>Password</label>
                                <div className='form-control p-0 d-flex'>
                                    <Field type={pass1type} name="password" className="form-control border-0 w-100" placeholder="*********" />
                                    {pass1visible === 1 ? (
                                        <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
                                            setPass1Visible(0);
                                            setPass1Type('password');
                                        }}></i>
                                    ) : (
                                        <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
                                            setPass1Visible(1);
                                            setPass1Type('text');
                                        }}></i>
                                    )}
                                </div>
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>
                        </div>
                        <div className='row mb-2'>
                            <div className='col'>
                                <label className='form-label'>Confirm Password</label>
                                <div className='form-control p-0 d-flex'>
                                    <Field type={pass2type} name="confirmPass" className="form-control border-0 w-100" placeholder="*********" />
                                    {pass2visible === 1 ? (
                                        <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
                                            setPass2Visible(0);
                                            setPass2Type('password');
                                        }}></i>
                                    ) : (
                                        <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
                                            setPass2Visible(1);
                                            setPass2Type('text');
                                        }}></i>
                                    )}
                                </div>
                                <ErrorMessage name="confirmPass" component="div" className="text-danger" />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <Link className='Link' to='/admin/login'>Login</Link>
                        </div>
                        <Button text="REGISTER" type="submit" />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AdminRegister;