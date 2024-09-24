import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddressForm = () => {
    const [submittedData, setSubmittedData] = useState([]);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Title is required"),
        street: Yup.string()
            .required("Street is required"),
        city: Yup.string()
            .required("City is required"),
        country: Yup.string()
            .required("Country is required"),
        pincode: Yup.string()
            .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
            .required("Pincode is required"),
    });

    const handleDelete = (index) => {
        const newData = submittedData.filter((_, i) => i !== index);
        setSubmittedData(newData);
    };

    return (
        <div className="container mt-5">
            <h2>Address Form</h2>
            <Formik
                initialValues={{
                    title: '',
                    street: '',
                    city: '',
                    country: '',
                    pincode: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    setSubmittedData([...submittedData, values]);
                    resetForm();
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <Field 
                                type="text" 
                                name="title" 
                                className="form-control" 
                            />
                            <ErrorMessage name="title" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="street">Street</label>
                            <Field 
                                type="text" 
                                name="street" 
                                className="form-control" 
                            />
                            <ErrorMessage name="street" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <Field 
                                type="text" 
                                name="city" 
                                className="form-control" 
                            />
                            <ErrorMessage name="city" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <Field 
                                type="text" 
                                name="country" 
                                className="form-control" 
                            />
                            <ErrorMessage name="country" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pincode">Pincode</label>
                            <Field 
                                type="text" 
                                name="pincode" 
                                className="form-control" 
                            />
                            <ErrorMessage name="pincode" component="div" className="text-danger" />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-3">
                            Add
                        </button>
                    </Form>
                )}
            </Formik>

            {submittedData.length > 0 && (
                <div className="mt-5">
                    <h3>Submitted Addresses:</h3>
                    <ul className="list-group">
                        {submittedData.map((data, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <strong>{data.title}</strong>: {data.street}, {data.city}, {data.country}, {data.pincode}
                                {/* Delete Button */}
                                <button onClick={() => handleDelete(index)} className="btn btn-danger btn-sm">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AddressForm;
