import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import '../styles/Signup.css';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const t = localStorage.getItem("token");

    useEffect(() => {
        if (localStorage.getItem('token')) {
            console.log("xdxxxxxxxx", t);
            navigate('/dashboard');
        }
    }, []);

    const addUser = async (formData: any) => {
        try {
            const response = await api.post(`${Local.CREATE_USER}`, formData);
            console.log("Response--->", response.data);
            localStorage.setItem("email", formData.email);
            localStorage.setItem("OTP", response.data.OTP);
            toast.success(response.data.message);
            return response;
        }
        catch (err: any) {
            toast.error(err?.response?.data?.message);
            return err;
        }
    }

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        doctype: Yup.number().required("Select Doctor Type"),
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters long").required("Password is required")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/\d/, "Password must contain at least one number")
            .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character"),
        confirmPass: Yup.string().required("Confirm Password is required")
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    const signupMutation = useMutation({
        mutationFn: addUser,
        onSuccess: () => { navigate("/Verify"); }
    });

    const signupHandler = (values: any) => {
        const { confirmPass, ...data } = values;
        signupMutation.mutate(data);
    }

    return (
        <div className="signup-wrapper">
            <div className="left-side">
                <img src="3716f6b2e790fb345b25.png" alt="Signup" className="signup-image" />
            </div>

            <div className="right-side">
                <h2 className="signup-heading">Signup</h2>
                <Formik
                    initialValues={{
                        firstname: '',
                        lastname: '',
                        doctype: '',
                        email: '',
                        password: '',
                        confirmPass: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={signupHandler}>
                    {() => (
                        <Form className="signup-form">
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
                                <label>Doctor Type:</label>
                                <Field as="select" name="doctype" className="form-control">
                                    <option value="" disabled>Select Doctor Type</option>
                                    <option value="1">MD</option>
                                    <option value="2">OD</option>
                                </Field>
                                <ErrorMessage name="doctype" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <Field type="email" name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Password:</label>
                                <Field type="password" name="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password:</label>
                                <Field type="password" name="confirmPass" className="form-control" />
                                <ErrorMessage name='confirmPass' component="div" className='text-danger' />
                            </div>

                            <button type='submit' className='btn btn-outline-primary'>Submit</button>
                        </Form>
                    )}
                </Formik>
                <p className="login-redirect">
                    Already have an account?{' '}
                    <Link to="/Login" className="login-link">
                        Login
                    </Link>
                </p>
            </div>
            <footer className="footer">
                <p>@2024 Eye Refer</p>
            </footer>
        </div>
    );
}

export default Signup;
