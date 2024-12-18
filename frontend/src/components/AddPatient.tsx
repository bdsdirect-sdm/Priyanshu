// import React, { useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import * as Yup from 'yup';
// import api from '../api/axiosInstance';
// import { Local } from '../environment/env';
// import '../styles/AddPatient.css';
// import socket from '../utils/Socket';

// const AddPatient: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   const addPatient = async (data: any) => {
//     try {
//       const response = await api.post(`${Local.ADD_PATIENT}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success('Patient referred successfully');
//       socket.emit('sendNotification', { 'pId': response.data.patient.uuid, 'code': 2 });
//       navigate('/patient');
//     } catch (err: any) {
//       toast.error(`${err.response?.data?.message || 'Error occurred'}`);
//     }
//   };

//   useEffect(() => {
//     if (!token) navigate('/login');
//     if (localStorage.getItem('doctype') === '1') navigate('/dashboard');
//   }, [navigate, token]);

//   const fetchDocs = async () => {
//     try {
//       const response = await api.get(`${Local.GET_DOC_LIST}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || 'Error fetching doctor list');
//     }
//   };

//   const { data: MDList, isLoading, isError, error } = useQuery({
//     queryKey: ['MDList'],
//     queryFn: fetchDocs,
//   });

//   const patientMutate = useMutation({
//     mutationFn: addPatient,
//   });

//   const validationSchema = Yup.object().shape({
//     firstname: Yup.string().required('First Name is required'),
//     lastname: Yup.string().required('Last Name is required'),
//     disease: Yup.string().required('Disease is required'),
//     referedto: Yup.string().required('Select Doctor'),
//     address: Yup.string().required('Address is required').nullable(),
//     referback: Yup.string().required('Please select an option'),
//     email: Yup.string().email('Invalid email format').required('Email is required'),
//     phoneNumber: Yup.string()
//       .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits') // Phone number validation
//       .required('Phone number is required'),
//     gender: Yup.string().required('Gender is required'),
//     timing: Yup.string().required('Timing is required'),
//     laterality: Yup.string().required('Laterality is required'),
//     dob: Yup.date()
//       .required('Date of Birth is required')
//       .max(new Date(), 'Date of Birth cannot be in the future'),
//     diseaseName: Yup.string()
//   });

//   const referPatientHandler = (values: any) => {
//     patientMutate.mutate(values);
//   };

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <div>Loading...</div>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="error-container">
//         <div>Error: {error?.message || 'Error loading data'}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="add-patient-container">
//       <h2 className="form-title">Basic Information</h2>
//       <Formik
//         initialValues={{
//           firstname: '',
//           lastname: '',
//           disease: '',
//           referedto: '',
//           address: '',
//           referback: '',
//           dob: '',
//           email: '',
//           phoneNumber: '',
//           gender: '',
//           diseaseName: '',
//           timing: '',
//           laterality: '',
//         }}
//         validationSchema={validationSchema}
//         onSubmit={referPatientHandler}
//       >
//         {({ values }) => (
//           <Form className="form-grid">
//             <div className="form-group">
//               <label>First Name:</label>
//               <Field type="text" name="firstname" placeholder="Enter First Name" className="form-control" />
//               <ErrorMessage name="firstname" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Last Name:</label>
//               <Field type="text" name="lastname" placeholder="Enter Last Name" className="form-control" />
//               <ErrorMessage name="lastname" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Disease:</label>
//               <Field as="select" name="disease" className="form-select">
//                 <option value="" disabled>Choose Disease</option>
//                 {['Cataract', 'Medical', 'Keratoconus', 'Corneal, Non-Keratoconus', 'Other'].map(disease => (
//                   <option key={disease} value={disease}>{disease}</option>
//                 ))}
//               </Field>
//               <ErrorMessage name="disease" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Disease Name:</label>
//               <Field type="text" name="diseaseName" placeholder="Enter Disease Name" className="form-control" />
//               <ErrorMessage name="diseaseName" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Doctor:</label>
//               <Field as="select" name="referedto" className="form-select">
//                 <option value="" disabled>Choose Doctor</option>
//                 {MDList?.docList?.map((md: any) => (
//                   <option key={md.uuid} value={md.uuid}>{md.firstname} {md.lastname}</option>
//                 ))}
//               </Field>
//               <ErrorMessage name="referedto" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Address:</label>
//               <Field as="select" name="address" className="form-select">
//                 <option value="" disabled>Choose Address</option>
//                 {values.referedto && MDList.docList.find((md: any) => md.uuid === values.referedto)?.Addresses.map((address: any) => (
//                   <option key={address.uuid} value={address.uuid}>
//                     {address.street} {address.district} {address.city} {address.state}
//                   </option>
//                 ))}
//               </Field>
//               <ErrorMessage name="address" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Return Back to Referrer:</label>
//               <div>
//                 <label className="me-3">
//                   <Field name="referback" type="radio" value="1" /> Yes
//                 </label>
//                 <label>
//                   <Field name="referback" type="radio" value="0" /> No
//                 </label>
//                 <ErrorMessage name="referback" component="div" className="text-danger" />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Date of Birth:</label>
//               <Field type="date" name="dob" className="form-control" />
//               <ErrorMessage name="dob" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Email:</label>
//               <Field type="email" name="email" placeholder="Enter Email" className="form-control" />
//               <ErrorMessage name="email" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Phone Number:</label>
//               <Field type="text" name="phoneNumber" placeholder="Enter Phone Number" className="form-control" />
//               <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Gender:</label>
//               <Field as="select" name="gender" className="form-select">
//                 <option value="" disabled>Choose Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </Field>
//               <ErrorMessage name="gender" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Timing:</label>
//               <Field type="text" name="timing" placeholder="Enter Timing" className="form-control" />
//               <ErrorMessage name="timing" component="div" className="text-danger" />
//             </div>

//             <div className="form-group">
//               <label>Laterality:</label>
//               <Field as="select" name="laterality" className="form-select">
//                 <option value="" disabled>Choose Laterality</option>
//                 <option value="Left">Left</option>
//                 <option value="Right">Right</option>
//                 <option value="Bilateral">Bilateral</option>
//               </Field>
//               <ErrorMessage name="laterality" component="div" className="text-danger" />
//             </div>

//             <div className="form-group text-center">
//               <button type="submit" className="btn btn-outline-primary">Add Referral</button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AddPatient;
///////////////
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import '../styles/AddPatient.css';
import socket from '../utils/Socket';
import { FaArrowLeft } from 'react-icons/fa'; // Importing the back button icon

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const addPatient = async (data: any) => {
    try {
      const response = await api.post(`${Local.ADD_PATIENT}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Patient referred successfully');
      socket.emit('sendNotification', { 'pId': response.data.patient.uuid, 'code': 2 });
      navigate('/patient');
    } catch (err: any) {
      toast.error(`${err.response?.data?.message || 'Error occurred'}`);
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    if (localStorage.getItem('doctype') === '1') navigate('/dashboard');
  }, [navigate, token]);

  const fetchDocs = async () => {
    try {
      const response = await api.get(`${Local.GET_DOC_LIST}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching doctor list');
    }
  };

  const { data: MDList, isLoading, isError, error } = useQuery({
    queryKey: ['MDList'],
    queryFn: fetchDocs,
  });

  const patientMutate = useMutation({
    mutationFn: addPatient,
  });

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    disease: Yup.string().required('Disease is required'),
    referedto: Yup.string().required('Select Doctor'),
    address: Yup.string().required('Address is required').nullable(),
    referback: Yup.string().required('Please select an option'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits') // Phone number validation
      .required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
    timing: Yup.string().required('Timing is required'),
    laterality: Yup.string().required('Laterality is required'),
    dob: Yup.date()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future'),
    diseaseName: Yup.string()
  });

  const referPatientHandler = (values: any) => {
    patientMutate.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <div>Error: {error?.message || 'Error loading data'}</div>
      </div>
    );
  }

  return (
    <div className="add-patient-container">
      {/* Back Button with icon */}
      <button
        onClick={() => navigate(-1)} // Navigates back to the previous page
        className="back-button">
        <FaArrowLeft size={20} /> {/* Back arrow icon */}
        Back
      </button>

      <h2 className="form-title">Basic Information</h2>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          disease: '',
          referedto: '',
          address: '',
          referback: '',
          dob: '',
          email: '',
          phoneNumber: '',
          gender: '',
          diseaseName: '',
          timing: '',
          laterality: '',
        }}
        validationSchema={validationSchema}
        onSubmit={referPatientHandler}
      >
        {({ values }) => (
          <Form className="form-grid">
            <div className="form-group">
              <label>First Name:</label>
              <Field type="text" name="firstname" placeholder="Enter First Name" className="form-control" />
              <ErrorMessage name="firstname" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <Field type="text" name="lastname" placeholder="Enter Last Name" className="form-control" />
              <ErrorMessage name="lastname" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Disease:</label>
              <Field as="select" name="disease" className="form-select">
                <option value="" disabled>Choose Disease</option>
                {['Cataract', 'Medical', 'Keratoconus', 'Corneal, Non-Keratoconus', 'Other'].map(disease => (
                  <option key={disease} value={disease}>{disease}</option>
                ))}
              </Field>
              <ErrorMessage name="disease" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Disease Name:</label>
              <Field type="text" name="diseaseName" placeholder="Enter Disease Name" className="form-control" />
              <ErrorMessage name="diseaseName" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Doctor:</label>
              <Field as="select" name="referedto" className="form-select">
                <option value="" disabled>Choose Doctor</option>
                {MDList?.docList?.map((md: any) => (
                  <option key={md.uuid} value={md.uuid}>{md.firstname} {md.lastname}</option>
                ))}
              </Field>
              <ErrorMessage name="referedto" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Address:</label>
              <Field as="select" name="address" className="form-select">
                <option value="" disabled>Choose Address</option>
                {values.referedto && MDList.docList.find((md: any) => md.uuid === values.referedto)?.Addresses.map((address: any) => (
                  <option key={address.uuid} value={address.uuid}>
                    {address.street} {address.district} {address.city} {address.state}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Return Back to Referrer:</label>
              <div>
                <label className="me-3">
                  <Field name="referback" type="radio" value="1" /> Yes
                </label>
                <label>
                  <Field name="referback" type="radio" value="0" /> No
                </label>
                <ErrorMessage name="referback" component="div" className="text-danger" />
              </div>
            </div>

            <div className="form-group">
              <label>Date of Birth:</label>
              <Field type="date" name="dob" className="form-control" />
              <ErrorMessage name="dob" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <Field type="email" name="email" placeholder="Enter Email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <Field type="number" name="phoneNumber" placeholder="Enter Phone Number" className="form-control" />
              <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <Field as="select" name="gender" className="form-select">
                <option value="" disabled>Choose Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Timing:</label>
              <Field type="time" name="timing" placeholder="Enter Timing" className="form-control" />
              <ErrorMessage name="timing" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label>Laterality:</label>
              <Field as="select" name="laterality" className="form-select">
                <option value="" disabled>Choose Laterality</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
                <option value="Bilateral">Bilateral</option>
              </Field>
              <ErrorMessage name="laterality" component="div" className="text-danger" />
            </div>

            <div className="form-group text-center">
              <button type="submit" className="btn btn-outline-primary">Add Referral</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPatient;
