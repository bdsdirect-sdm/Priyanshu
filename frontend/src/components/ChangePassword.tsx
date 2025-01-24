import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import sideimg from '../assets/images/Layer_1.png';
import { useMutation } from '@tanstack/react-query';
import api from '../utils/axiosInstance';
import Local from '../environment/env';
import Button from '../common/components/CommonButton';
import { toast } from 'react-toastify';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [pass1type, setPass1Type] = useState('password');
  const [pass1visible, setPass1Visible] = useState(0);
  const [pass2type, setPass2Type] = useState('password');
  const [pass2visible, setPass2Visible] = useState(0);
  const [pass3type, setPass3Type] = useState('password');
  const [pass3visible, setPass3Visible] = useState(0);

  const validationSchema = Yup.object().shape({
    prevPass: Yup.string().required('Old password is required'),
    newPass: Yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character"),
    confirmPass: Yup.string().required("Confirm Password is required")
      .oneOf([Yup.ref('newPass')], 'Passwords must match')
  });

  const updatePassword = async (data: any) => {
    try {
      const response = await api.put(`${Local.EDIT_PASSWORD}`, { data }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      toast.success(`${response.data.message}`);
      navigate('/app/dashboard');
    }
    catch (err: any) {
      toast.error(`${err.response.data.message}`);
    }
  }

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword
  })

  const updateHandler = (values: any) => {
    const { confirmPassword, ...data } = values
    updatePasswordMutation.mutate(data);
  }
  return (
    <div>
      <div>
        <p
          className="h5 pb-3 d-flex bg-secondary-subtle w-25"
          onClick={() => navigate(-1)}
        >
          <svg
            width="24"
            height="25"
            viewBox="0 0 26 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="me-4 pt-1"
          >
            <path
              d="M25.3467 10.4067C25.3467 10.9899 24.9133 11.472 24.3509 11.5483L24.1946 11.5588L1.15258 11.5588C0.516294 11.5588 0.000482559 11.043 0.000482559 10.4067C0.000482559 9.82341 0.433908 9.34138 0.99625 9.26509L1.15258 9.25458L24.1946 9.25458C24.8309 9.25458 25.3467 9.77039 25.3467 10.4067Z"
              fill="#292929"
              fillOpacity="0.8"
            />
            <path
              d="M11.2588 18.8446C11.7097 19.2935 11.7112 20.023 11.2623 20.4739C10.8541 20.8838 10.2142 20.9223 9.76242 20.5886L9.63296 20.4774L0.339355 11.2237C-0.0717716 10.8144 -0.109172 10.1721 0.227171 9.72034L0.339287 9.59096L9.63289 0.335757C10.0837 -0.113233 10.8132 -0.111723 11.2622 0.339131C11.6704 0.748998 11.7062 1.38912 11.3706 1.83946L11.2588 1.96844L2.78547 10.4078L11.2588 18.8446Z"
              fill="#292929"
              fillOpacity="0.8"
            />
          </svg>
          Change Passwords
        </p>
      </div>

      <div className='bg-white rounded pb-4' >
        <div className='row ' >
          <div className='m-2 col-6' >
            <Formik
              initialValues={{
                prevPass: '',
                newPass: '',
                confirmPassword: ''
              }}
              validationSchema={validationSchema}
              onSubmit={updateHandler}
            >
              {() => (
                <Form className='' >
                  <div className='ms-3 '>
                    <label className="form-label text-secondary"> Old Password </label>
                    <div className='d-flex form-control ' >
                      <Field type={pass1type} name="prevPass" className="form-control border-0 focus-ring-dark w-100 " placeholder="* * * * * *" />
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
                    <ErrorMessage component='div' name="prevPass" className="text-danger ms-2" />
                  </div>
                  <div className='ms-3 mt-2 '>
                    <label className="form-label text-secondary"> New Password </label>
                    <div className='d-flex form-control ' >
                      <Field type={pass2type} name="newPass" className="form-control border-0 focus-ring-dark w-100 " placeholder="* * * * * *" />
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
                    <ErrorMessage component='div' name="newPass" className="text-danger ms-2" />
                  </div>
                  <div className='ms-3 mt-2 '>
                    <label className="form-label text-secondary"> Confirm Password </label>
                    <div className='d-flex form-control ' >
                      <Field type={pass3type} name="confirmPass" className="form-control border-0 focus-ring-dark w-100 " placeholder="* * * * * *" />
                      {pass3visible == 1 && (
                        <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
                          setPass3Visible(0);
                          setPass3Type('password');
                        }} ></i>
                      )}
                      {pass3visible == 0 && (
                        <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
                          setPass3Visible(1);
                          setPass3Type('text');
                        }} ></i>
                      )}
                    </div>
                    <ErrorMessage component='div' name="confirmPass" className="text-danger ms-2" />
                  </div>

                  <div className='mt-4 ' >
                    <div className='w-25 ms-auto' >
                      <Button text='Update' type='submit' />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className='col-5 my-auto ms-5 ps-5 '>
            <img src={`${sideimg}`} alt="password_img" height={'270px'} className='ms-5' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword