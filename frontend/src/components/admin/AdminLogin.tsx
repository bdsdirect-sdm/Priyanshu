import React, { useState } from 'react';
// import './admin_login.css'; // Add your custom styles for the login form
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInstance'; // Adjust the path as necessary
import Local from '../../environment/env'; // Adjust the path as necessary
import Button from '../../common/components/CommonButton'; // Adjust the path as necessary
import { useMutation } from '@tanstack/react-query';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [passType, setPassType] = useState('password');
    const [passVisible, setPassVisible] = useState(false);

    // API call to log in the admin
    const loginAdmin = async (formData: any) => {
        try {
            const response = await api.post(`${Local.LOGIN_ADMIN}`, formData); // Replace with your actual API path
            toast.success(response.data.message);
            localStorage.setItem("token", response.data.token); // Store token in local storage
            localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user info
            navigate('/admin/dashboard'); // Redirect to the dashboard after successful login
        } catch (err: any) {
            toast.error(`${err.response?.data?.message || "Something went wrong"}`);
            // console.error(err);
        }
    };

    // Validation schema for form inputs
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters long")
            .required("Password is required")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/\d/, "Password must contain at least one number")
            .matches(/[\`~!@#$%^&*()?<>|:{}(),.]/, "Password must contain at least one special character"),
    });

    const loginMutation = useMutation({
        mutationFn: loginAdmin,
    });

    // Form submit handler
    const submitHandler = (values: any) => {
        loginMutation.mutate(values);
    };

    return (
        <div className='form-container'>
            <div className='mt-5 mb-5'>
                <h1 className='text-center'>ADMIN LOGIN</h1>
                <hr className='opacity-100 rounded' />
            </div>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
            >
                {() => (
                    <Form>
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
                                    <Field type={passType} name="password" className="form-control border-0 w-100" placeholder="*********" />
                                    {passVisible ? (
                                        <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => { setPassVisible(false); setPassType('password'); }}></i>
                                    ) : (
                                        <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => { setPassVisible(true); setPassType('text'); }}></i>
                                    )}
                                </div>
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>
                        </div>

                        <div className='mb-4'>
                            {/* <Link className='Link' to='/admin/forgot-password'>Forgot Password?</Link> */}
                        </div>

                        <Button text="LOGIN" type="submit" />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AdminLogin;
