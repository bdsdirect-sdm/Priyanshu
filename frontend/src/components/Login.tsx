import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import '../styles/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, []);

  const authUser = async (loginData: any) => {
    try {
      const response: any = await api.post(`${Local.LOGIN_USER}`, loginData);
      console.log('Hello', response);
      if (response.status === 200) {
        if (response.data.user.is_verified) {
          localStorage.setItem('doctype', response.data.user.doctype);
          localStorage.setItem('token', response.data.token);

          localStorage.setItem("user_firstname", response.data.user.firstname)
          localStorage.setItem("user_lastname", response.data.user.lastname)
          toast.success('Login Successfully');
          navigate('/dashboard');
        } else {
          localStorage.setItem('email', response?.data?.user?.email);
          localStorage.setItem('OTP', response.data.OTP);
          toast.warn('User not Verified');
          navigate('/Verify');
        }
        return response;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      return;
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, 'Password must contain at least one special Character'),
  });

  const loginMutate = useMutation({
    mutationFn: authUser,
  });

  const loginSubmit = async (values: any) => {
    loginMutate.mutate(values);
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="3716f6b2e790fb345b25.png" alt="Login Illustration" />
      </div>

      <div className="login-form">
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={loginSubmit}
        >
          {() => (
            <Form>
              <div className="form-group">
                <div className='page-heading'><h2>Log In</h2></div>
                <label>User email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                  className="form-control"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your Password"
                  className="form-control"
                />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>
              <br />
              <button type="submit" className="btn btn-outline-dark">
                Login
              </button>
              <div className="signup-link"><p>Don't have an Account ?

                <Link to={'/'}>  Sign Up </Link></p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <footer className="footer">
        <p>@2024 Eye Refer</p>
      </footer>
    </div>
  );
};

export default Login;
