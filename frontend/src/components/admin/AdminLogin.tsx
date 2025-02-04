import React, { useState } from 'react';
import './admin_login.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { replace, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInstance';
import Local from '../../environment/env';
import Button from '../../common/components/CommonButton';
import { useMutation } from '@tanstack/react-query';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [passType, setPassType] = useState('password');
    const [passVisible, setPassVisible] = useState(false);

    const loginAdmin = async (formData: any) => {
        try {
            const response = await api.post(`${Local.LOGIN_ADMIN}`, formData);
            toast.success(response.data.message);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            window.history.pushState(null, '', window.location.href);
            window.onpopstate = () => {
                window.history.go(1);
            };

            navigate('/admin/dashboard', { replace: true });
        } catch (err: any) {
            toast.error(`${err.response?.data?.message || "Something went wrong"}`);
        }
    };

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
