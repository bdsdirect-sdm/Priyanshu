import React, { useState } from 'react';
import './sidebar.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';
import Local from '../environment/env';
import { useNavigate } from 'react-router-dom';
import Button from '../common/components/CommonButton';
import { IoIosArrowRoundBack } from "react-icons/io";

// Assuming 'user' is being retrieved correctly from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('basic'); // State for active tab
    const navigate = useNavigate();

    // Function to handle profile update
    const updateProfile = async (formData: any) => {
        try {
            console.log("Updating profile with data: ", formData); // Debugging: Log the form data
            const token = localStorage.getItem('token'); // Get the auth token from localStorage
            const response = await api.post(
                `${Local.UPDATE_PROFILE}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log("API Response: ", response); // Debugging: Log the response
            toast.success(response.data.message);

            // After successful update, save the updated data in localStorage
            const updatedUser = {
                ...user, // Preserve existing values from the localStorage 'user'
                ...formData, // Replace with the updated form data
            };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Save the updated user data to localStorage

            navigate('/dashboard');
        } catch (err: any) {
            console.error("API Error: ", err); // Debugging: Log any error
            toast.error(`${err.response?.data?.message || "Something went wrong"}`);
        }
    };

    // Validation schema for basic details
    const basicValidationSchema = Yup.object().shape({
        firstname: Yup.string().required('First Name is required'),
        lastname: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Mobile Number is required').matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
        address_one: Yup.string().required('Address Line 1 is required'),
        address_two: Yup.string().optional(),
        city: Yup.string().required('City is required'),
        state: Yup.string().optional(),
        zip_code: Yup.string().optional().matches(/^\d{5}$/, 'Zip code must be 5 digits'),
    });

    // Validation schema for personal details
    const personalValidationSchema = Yup.object().shape({
        dob: Yup.date().required('Date of Birth is required'),
        gender: Yup.string().required('Gender is required'),
        maritalStatus: Yup.string().required('Marital Status is required'),
        social_security: Yup.string().required('Social Security number is required').matches(/^\d{9}$/, 'Social Security number must be exactly 9 digits'),
        kids: Yup.number().optional().min(0, 'Kids count must be at least 0').integer('Kids count must be an integer'),
    });

    // Form submission handler
    const submitHandler = (values: any) => {
        console.log("Form data being submitted: ", values); // Check the values
        updateProfile(values);
    };

    return (
        <>
            <div className="h-100">
                <div className="full-form">
                    <div className="mt-5 mb-5">
                        <h3 className="text"><IoIosArrowRoundBack /> Profile </h3>
                        <h6> Change Information</h6>
                        <hr className="opacity-100 rounded ms-5 pt-0 mt-0" />
                    </div>

                    {/* Tabs */}
                    <div className="ms-5">
                        <ul className="nav nav-tabs" id="profileTabs">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('basic')}
                                    role="button"
                                >
                                    Basic Details
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('personal')}
                                    role="button"
                                >
                                    Personal Details
                                </a>
                            </li>
                        </ul>

                        {/* Basic Details Form */}
                        {activeTab === 'basic' && (
                            <Formik
                                initialValues={{
                                    firstname: user.firstname || '',
                                    lastname: user.lastname || '',
                                    email: user.email || '',
                                    socialsecurity: user.social_security,
                                    phone: user.phone || '',
                                    address_one: user.address_one || '',
                                    address_two: user.address_two || '',
                                    city: user.city || '',
                                    state: user.state || '',
                                    zip_code: user.zip_code || '',
                                }}
                                validationSchema={basicValidationSchema}
                                onSubmit={submitHandler}
                            >
                                {({ isValid }) => {
                                    console.log("Form Validity: ", isValid); // Check if form is valid
                                    return (
                                        <Form>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">First Name</label>
                                                    <Field type="text" name="firstname" className="form-control" placeholder="George" />
                                                    <ErrorMessage name="firstname" component="div" className="text-danger" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Last Name</label>
                                                    <Field type="text" name="lastname" className="form-control" placeholder="Henry" />
                                                    <ErrorMessage name="lastname" component="div" className="text-danger" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Enter Email</label>
                                                    <Field type="email" name="email" className="form-control" placeholder="john@example.com" />
                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Social Security Number</label>
                                                    <Field type="text" name="social_security" className="form-control" maxLength={9} placeholder="SSN" />
                                                    <ErrorMessage name="socialSecurity" component="div" className="text-danger" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Mobile Number</label>
                                                    <Field type="text" name="phone" className="form-control" maxLength={10} placeholder="Enter your mobile number" />
                                                    <ErrorMessage name="phone" component="div" className="text-danger" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Address One</label>
                                                    <Field type="text" name="address_one" className="form-control" placeholder="123 Main St" />
                                                    <ErrorMessage name="address_one" component="div" className="text-danger" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Address Two</label>
                                                    <Field type="text" name="address_two" className="form-control" placeholder="123 Main St" />
                                                    <ErrorMessage name="address_two" component="div" className="text-danger" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">City</label>
                                                    <Field type="text" name="city" className="form-control" placeholder="New York" />
                                                    <ErrorMessage name="city" component="div" className="text-danger" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">State</label>
                                                    <Field type="text" name="state" className="form-control" placeholder="State" />
                                                    <ErrorMessage name="state" component="div" className="text-danger" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Zip Code</label>
                                                    <Field type="text" name="zip_code" className="form-control" placeholder="12345" />
                                                    <ErrorMessage name="zip_code" component="div" className="text-danger" />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <Button text="Update" type="submit" />
                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        )}

                        {/* Personal Details Form */}
                        {activeTab === 'personal' && (
                            <Formik
                                initialValues={{
                                    dob: user.dob || '',
                                    gender: user.gender || '',
                                    maritalStatus: user.maritalStatus || '',
                                    social_security: user.social_security || '',
                                    kids: user.kids || 0,
                                }}
                                validationSchema={personalValidationSchema}
                                onSubmit={submitHandler}
                            >
                                {() => (
                                    <Form>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">DOB</label>
                                                <Field type="date" name="dob" className="form-control" />
                                                <ErrorMessage name="dob" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Gender</label>
                                                <Field as="select" name="gender" className="form-control">
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </Field>
                                                <ErrorMessage name="gender" component="div" className="text-danger" />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Marital Status</label>
                                                <Field as="select" name="maritalStatus" className="form-control">
                                                    <option value="">Select Marital Status</option>
                                                    <option value="single">Single</option>
                                                    <option value="married">Married</option>
                                                    <option value="divorced">Divorced</option>
                                                </Field>
                                                <ErrorMessage name="maritalStatus" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Social Security (Number Only)</label>
                                                <Field type="text" name="socialSecurity" className="form-control" maxLength={9} placeholder="SSN" />
                                                <ErrorMessage name="socialSecurity" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Kids (If Any)</label>
                                                <Field type="number" name="kids" className="form-control" min={0} />
                                                <ErrorMessage name="kids" component="div" className="text-danger" />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <Button text="Update" type="submit" />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
