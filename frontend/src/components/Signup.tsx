import React, { useState } from 'react';
import './sidebar.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Local from '../environment/env';
import api from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../common/components/CommonButton';
// import userAuthMiddleware from '../utils/inviteCodeDecrypt';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [pass1type, setPass1Type] = useState('password');
    const [pass1visible, setPass1Visible] = useState(0);
    const [pass2type, setPass2Type] = useState('password');
    const [pass2visible, setPass2Visible] = useState(0);
    const { url } = useParams();
    const data = url || 0

    if (url) {
        console.log(url);
    }

    const registerUser = async (formData: any) => {
        try {
            const response = await api.post(`${Local.CREATE_USER}`, { formData, data });
            toast.success(response.data.message);
            navigate('/login');
        }
        catch (err: any) {
            toast.error(`${err.response.data.message}`);
            console.log(err);
        }
    }

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required("First Name is required"),
        lastname: Yup.string().required("Last Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phone: Yup.string().required("Phone is required").matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        password: Yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/\d/, "Password must contain at least one number")
            .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character"),
        confirmPass: Yup.string().required("Confirm Password is required")
            .oneOf([Yup.ref('password')], 'Passwords must match')
    })

    const signupMutation = useMutation({
        mutationFn: registerUser,
    });

    const submitHandler = (values: any) => {
        const { confirmPass, ...data } = values;
        signupMutation.mutate(data);

    }


    return (
        <>
            <div className='h-100'>
                <div className='position-absolute mt-5'>
                    <div className='mt-5  '>
                        <h1 className=' text-3xl text-center position-absolute top-0 pb-0 ms-5'>Sign Up</h1>
                        <hr className=' opacity-100 rounded ms-5 ' />
                    </div>

                    <div className='ms-5'>
                        <Formik
                            initialValues={{
                                firstname: '',
                                lastname: '',
                                email: '',
                                phone: '',
                                password: '',
                                confirmPass: ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={submitHandler}>
                            {() => (
                                <Form>
                                    <div className='row mb-3'>
                                        <div className='col-md-6'>
                                            <label className='form-label'>First Name</label>
                                            <Field type="text" name="firstname" className="form-control" placeholder="George" />
                                            <ErrorMessage name="firstname" component="div" className="text-danger" />
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='form-label'>Last Name</label>
                                            <Field type="text" name="lastname" className="form-control" placeholder="Henry" />
                                            <ErrorMessage name="lastname" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col'>
                                            <label className='form-label'>Enter Email</label>
                                            <Field type="email" name="email" className="form-control" placeholder="john@example.com" />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col'>
                                            <label className='form-label'>Enter Phone No.</label>
                                            <Field type="string" name="phone" className="form-control focus-ring-dark" maxLength={10} placeholder="Enter your phone number" />
                                            <ErrorMessage name="phone" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col'>
                                            <label className='form-label'>Password</label>
                                            <div className='form-control p-0 d-flex focus-ring' >
                                                <Field type={pass1type} name="password" className="form-control border-0 focus-ring-dark w-100  " placeholder="*********" />
                                                {pass1visible == 1 && (
                                                    <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
                                                        setPass1Visible(0);
                                                        setPass1Type('password');
                                                    }} ></i>
                                                )}
                                                {pass1visible == 0 && (
                                                    <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
                                                        setPass1Visible(1);
                                                        setPass1Type('text');
                                                    }} ></i>
                                                )}
                                            </div>
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <label className='form-label'>Confirm Password</label>
                                            <div className='form-control p-0 d-flex focus-ring' >
                                                <Field type={pass2type} name="confirmPass" className="form-control border-0 focus-ring-dark w-100  " placeholder="*********" />
                                                {pass2visible == 1 && (
                                                    <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
                                                        setPass2Visible(0);
                                                        setPass2Type('password');
                                                    }} ></i>
                                                )}
                                                {pass2visible == 0 && (
                                                    <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
                                                        setPass2Visible(1);
                                                        setPass2Type('text');
                                                    }} ></i>
                                                )}
                                            </div>
                                            <ErrorMessage name="confirmPass" component="div" className="text-danger" />
                                        </div>
                                    </div>

                                    <div className='mb-4'>
                                        <Link className='Link' to='/login' >Login</Link>
                                    </div>

                                    {/* <button type="submit" className='btn px-5 text-white btn-clr' >SIGN UP</button> */}
                                    <Button text="SIGN UP" type="submit" />

                                </Form>
                            )}

                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup