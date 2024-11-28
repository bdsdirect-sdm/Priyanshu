import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import React, { useEffect } from 'react';

const token = localStorage.getItem('token');

interface AddAddressProps {
  onAdd: (newAddress: string) => void;
}

const AddAddress: React.FC<AddAddressProps> = ({ onAdd }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, []);

  const addAddress = async (data: any) => {
    try {
      const response = await api.post(`${Local.ADD_ADDRESS}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      toast.error(`${err.response.message}`);
    }
  };

  const addressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: (data) => {
      toast.success("Address Saved");
      onAdd(data.address);
      navigate("/profile");
    },
  });

  const validationSchema = Yup.object().shape({
    street: Yup.string().required("Street is required"),
    district: Yup.string().required("District is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string().required("Phone number is required"),
    pincode: Yup.number().required("Pincode is required"),
  });

  const addressHandler = (values: any) => {
    addressMutation.mutate(values);
  };

  return (
    <Formik
      initialValues={{
        street: "",
        district: "",
        state: "",
        city: "",
        phone: "",
        pincode: "",
      }}
      validationSchema={validationSchema}
      onSubmit={addressHandler}
    >
      {() => (
        <Form>
          <div className="form-group">
            <label>Street</label>
            <Field type="text" name="street" className="form-control" />
            <ErrorMessage name="street" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>District</label>
            <Field type="text" name="district" className="form-control" />
            <ErrorMessage name="district" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>State</label>
            <Field type="text" name="state" className="form-control" />
            <ErrorMessage name="state" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>City</label>
            <Field type="text" name="city" className="form-control" />
            <ErrorMessage name="city" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>Phone</label>
            <Field type="text" name="phone" maxLength={10} className="form-control" />
            <ErrorMessage name="phone" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>Pincode</label>
            <Field type="text" name="pincode" maxLength={6} className="form-control" />
            <ErrorMessage name="pincode" component="div" className="text-danger" />
          </div>
          <br />
          <button type="submit" className='btn btn-outline-dark'>Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default AddAddress;
