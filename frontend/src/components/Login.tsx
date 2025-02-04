// import React, { useState } from 'react'
// import './sidebar.css'
// import * as Yup from 'yup';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import { useMutation } from '@tanstack/react-query';
// import { toast } from 'react-toastify';
// import api from '../utils/axiosInstance';
// import Local from '../environment/env';
// import Button from '../common/components/CommonButton'

// const Signup: React.FC = () => {
//     const navigate = useNavigate();
//     const [pass1type, setPass1Type] = useState('password');
//     const [pass1visible, setPass1Visible] = useState(0);
//     const { url } = useParams();
//     const data = url || 0

//     if (url) {
//         console.log(url);
//     }

//     const authUser = async (formData: any) => {
//         try {
//             const response = await api.post(`${Local.AUTH_USER}`, { formData, data });
//             toast.success(response.data.message);
//             localStorage.setItem("token", response.data.token);
//             localStorage.setItem("user", JSON.stringify(response.data.user));
//             navigate('/app/dashboard')
//         }
//         catch (err: any) {
//             toast.error(err.response.data.message);
//         }
//     }

//     const validationSchema = Yup.object().shape({
//         email: Yup.string().email("Invalid email").required("Email is required"),
//         password: Yup.string().min(8, "atleast 8 characters long").required("Password is required")
//             .matches(/[a-z]/, "atleast one lowercase letter")
//             .matches(/[A-Z]/, "atleast one uppercase letter")
//             .matches(/\d/, "atleast one number")
//             .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "atleast one special Character")
//     })

//     const signupMutation = useMutation({
//         mutationFn: authUser,
//     });

//     const submitHandler = (values: any) => {
//         signupMutation.mutate(values);
//     }

//     return (
//         <>
//             <div className='h-100'>
//                 <div className='lc p-5 ms-5 mt-5'>
//                     <div className='mt-5 ms-5 mb-5'>
//                         <h2 className='text-center w-100 text-3xl mb-3 '>Login Your Account</h2>
//                         <hr className=' opacity-100 rounded ' />
//                     </div>

//                     <div className='ms-5'>
//                         <Formik
//                             initialValues={{
//                                 email: '',
//                                 password: '',
//                             }}
//                             validationSchema={validationSchema}
//                             onSubmit={submitHandler}>
//                             {() => (
//                                 <Form>
//                                     <div className='row mb-3'>
//                                         <div className='col'>
//                                             <label className='form-label'>Email Address </label>
//                                             <Field type="email" name="email" className="form-control" placeholder="john@example.com" />
//                                             <ErrorMessage name="email" component="div" className="text-danger" />
//                                         </div>
//                                     </div>
//                                     <div className='row mb-3'>
//                                         <div className='col'>
//                                             <label className='form-label'>Password</label>
//                                             <div className='form-control p-0 d-flex focus-ring' >
//                                                 <Field type={pass1type} name="password" className="form-control border-0 focus-ring-dark w-100  " placeholder="*********" />
//                                                 {pass1visible == 1 && (
//                                                     <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
//                                                         setPass1Visible(0);
//                                                         setPass1Type('password');
//                                                     }} ></i>
//                                                 )}
//                                                 {pass1visible == 0 && (
//                                                     <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
//                                                         setPass1Visible(1);
//                                                         setPass1Type('text');
//                                                     }} ></i>
//                                                 )}
//                                             </div>
//                                             <ErrorMessage name="password" component="div" className="text-danger" />
//                                         </div>
//                                     </div>


//                                     <div className='mb-4'>
//                                         <Link className='Link' to='/Signup' >Signup</Link>
//                                     </div>

//                                     {/* <button type="submit" className='btn px-5 text-white btn-clr' >LOGIN</button> */}
//                                     <Button text="LOGIN" type="submit" />

//                                 </Form>
//                             )}

//                         </Formik>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Signup
//////////
import React, { useState, useEffect } from 'react';
import './sidebar.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';
import Local from '../environment/env';
import Button from '../common/components/CommonButton';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [pass1type, setPass1Type] = useState('password');
    const [pass1visible, setPass1Visible] = useState(0);
    const { url } = useParams();
    const data = url || 0;

    const authUser = async (formData: any) => {
        try {
            const response = await api.post(`${Local.AUTH_USER}`, { formData, data });
            toast.success(response.data.message);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Store login time in localStorage (current time)
            const loginTime = new Date().getTime();
            localStorage.setItem('loginTime', loginTime.toString());

            // Navigate to the dashboard
            navigate('/app/dashboard');
        } catch (err: any) {
            toast.error(err.response.data.message);
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string()
            .min(8, 'at least 8 characters long')
            .required('Password is required')
            .matches(/[a-z]/, 'at least one lowercase letter')
            .matches(/[A-Z]/, 'at least one uppercase letter')
            .matches(/\d/, 'at least one number')
            .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, 'at least one special Character'),
    });

    const signupMutation = useMutation({
        mutationFn: authUser,
    });

    const submitHandler = (values: any) => {
        signupMutation.mutate(values);
    };

    // Lock the back button after login using useEffect
    useEffect(() => {
        const checkSession = () => {
            const loginTime = localStorage.getItem('loginTime');
            const token = localStorage.getItem('token');

            if (token && loginTime) {
                const currentTime = new Date().getTime();
                const timeElapsed = currentTime - parseInt(loginTime);

                // If more than 5 minutes have passed, log out the user
                if (timeElapsed > 300000) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('loginTime');
                    toast.error('Your session has expired. Please log in again.');
                    navigate('/login'); // Redirect to login page
                }
            } else {
                // If no token, just navigate to login
                navigate('/login');
            }
        };

        // Run session check when component mounts or the tab is reopened
        checkSession();

        // Set a timeout to log out after 5 minutes of login
        const logoutTimer = setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('loginTime');
            toast.error('Your session has expired. Please log in again.');
            navigate('/login'); // Redirect to login page
        }, 300000); // 5 minutes in ms

        // Cleanup the timeout on unmount
        return () => clearTimeout(logoutTimer);
    }, [navigate]);

    // Handle tab close (detect when user closes the tab or navigates away)
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Clear session if the tab is closed or reloaded
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('loginTime');
        };

        // Attach event listener for tab close
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup event listener when the component unmounts
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return (
        <>
            <div className="h-100">
                <div className="lc p-5 ms-5 mt-5">
                    <div className="mt-5 ms-5 mb-5">
                        <h2 className="text-center w-100 text-3xl mb-3 ">Login Your Account</h2>
                        <hr className=" opacity-100 rounded " />
                    </div>

                    <div className="ms-5">
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={submitHandler}>
                            {() => (
                                <Form>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label className="form-label">Email Address </label>
                                            <Field
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="john@example.com"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label className="form-label">Password</label>
                                            <div className="form-control p-0 d-flex focus-ring">
                                                <Field
                                                    type={pass1type}
                                                    name="password"
                                                    className="form-control border-0 focus-ring-dark w-100"
                                                    placeholder="*********"
                                                />
                                                {pass1visible === 1 && (
                                                    <i
                                                        className="bi bi-eye me-3 pt-1 text-secondary"
                                                        onClick={() => {
                                                            setPass1Visible(0);
                                                            setPass1Type('password');
                                                        }}></i>
                                                )}
                                                {pass1visible === 0 && (
                                                    <i
                                                        className="bi bi-eye-slash me-3 pt-1 text-secondary"
                                                        onClick={() => {
                                                            setPass1Visible(1);
                                                            setPass1Type('text');
                                                        }}></i>
                                                )}
                                            </div>
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <Link className="Link" to="/Signup">
                                            Signup
                                        </Link>
                                    </div>

                                    <Button text="LOGIN" type="submit" />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
