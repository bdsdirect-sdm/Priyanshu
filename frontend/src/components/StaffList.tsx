// import React, { useState, useEffect } from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import api from '../api/axiosInstance';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Staff.css';

// // Yup validation schema
// const validationSchema = Yup.object({
//   staffName: Yup.string().required('Staff Name is required'),
//   email: Yup.string().email('Invalid email format').required('Email is required'),
//   contact: Yup.string()
//     .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
//     .required('Contact is required'),
//   gender: Yup.string().required('Gender is required'),
// });

// const Staff: React.FC = () => {
//   const navigate = useNavigate();

//   const [staffList, setStaffList] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const fetchStaffList = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Please log in to view staff.');
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await api.get('/staff-list', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           search: searchQuery,
//         },
//       });

//       if (response.data.success) {
//         setStaffList(response.data.staff);
//       } else {
//         toast.error(response.data.message || 'Failed to fetch staff list');
//       }
//     } catch (err: any) {
//       toast.error(`Error: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchStaffList();
//   }, [searchQuery]);

//   const handleAddStaff = async (values: any) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Please log in to add staff.');
//       navigate('/login');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await api.post('/add-staff', values, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         toast.success('Staff added successfully');
//         fetchStaffList();
//         setIsModalOpen(false);
//       } else {
//         toast.error(response.data.message || 'Failed to add staff');
//       }
//     } catch (err: any) {
//       toast.error(`Error: ${err.response?.data?.message || err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSearch = () => {
//     fetchStaffList();
//   };

//   return (
//     <div className="staff-form-container">
//       <div className='heading-dashboard'>
//         <h3>Staff list</h3>
//         <button className="btn-color" onClick={handleOpenModal}>
//           Add Staff
//         </button>
//       </div>

//       <div className="search-container">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search staff by name, email, or contact"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button
//           className="btn-search"
//           onClick={handleSearch}
//         >
//           Search
//         </button>
//       </div>

//       <div className="staff-list">
//         {staffList.length === 0 ? (
//           <p>No staff members found.</p>
//         ) : (
//           <table className="staff-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Contact</th>
//                 <th>Gender</th>
//               </tr>
//             </thead>
//             <tbody>
//               {staffList.map((staff: any) => (
//                 <tr key={staff.id}>
//                   <td>{staff.staffName}</td>
//                   <td>{staff.email}</td>
//                   <td>{staff.contact}</td>
//                   <td>{staff.gender}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {isModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={handleCloseModal}>&times;</span>
//             <h3>Add New Staff</h3>
//             <Formik
//               initialValues={{
//                 staffName: '',
//                 email: '',
//                 contact: '',
//                 gender: 'Male',
//               }}
//               validationSchema={validationSchema}
//               onSubmit={handleAddStaff}
//             >
//               {({ isSubmitting }) => (
//                 <Form className="staff-form">
//                   <div className="form-group">
//                     <label htmlFor="staffName">Staff Name</label>
//                     <Field
//                       type="text"
//                       id="staffName"
//                       name="staffName"
//                       className="form-control"
//                     />
//                     <ErrorMessage name="staffName" component="div" className="error" />
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <Field
//                       type="email"
//                       id="email"
//                       name="email"
//                       className="form-control"
//                     />
//                     <ErrorMessage name="email" component="div" className="error" />
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="contact">Contact</label>
//                     <Field
//                       type="text"
//                       id="contact"
//                       name="contact"
//                       className="form-control"
//                     />
//                     <ErrorMessage name="contact" component="div" className="error" />
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="gender">Gender</label>
//                     <Field as="select" id="gender" name="gender" className="form-control">
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </Field>
//                     <ErrorMessage name="gender" component="div" className="error" />
//                   </div>

//                   <button
//                     type="submit"
//                     className="btn"
//                     disabled={isSubmitting || loading}
//                   >
//                     {loading ? 'Adding Staff...' : 'Add Staff'}
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Staff;
///////////////
import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/Staff.css';

// Yup validation schema
const validationSchema = Yup.object({
  staffName: Yup.string().required('Staff Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  contact: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Contact is required'),
  gender: Yup.string().required('Gender is required'),
});

const Staff: React.FC = () => {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStaffList, setFilteredStaffList] = useState<any[]>([]); // Added state to store filtered staff list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all staff list once on component mount
  const fetchStaffList = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to view staff.');
      navigate('/login');
      return;
    }

    try {
      const response = await api.get('/staff-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStaffList(response.data.staff); // Save the complete staff list
        setFilteredStaffList(response.data.staff); // Initially show all staff
      } else {
        toast.error(response.data.message || 'Failed to fetch staff list');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // Run once when the component is mounted
  useEffect(() => {
    fetchStaffList();
  }, []);

  // Handle searching/filtering the staff list on the frontend
  const handleSearch = () => {
    const filteredData = staffList.filter(
      (staff) =>
        staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.contact.includes(searchQuery)
    );
    setFilteredStaffList(filteredData);
  };

  const handleAddStaff = async (values: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to add staff.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/add-staff', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Staff added successfully');
        fetchStaffList(); // Re-fetch the staff list after adding
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message || 'Failed to add staff');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="staff-form-container">
      <div className="heading-dashboard">
        <h3>Staff list</h3>
        <button className="btn-color" onClick={handleOpenModal}>
          Add Staff
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="form-control"
          placeholder="Search "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
        <button
          className="btn-search"
          onClick={handleSearch} // Trigger filtering on button click
        >
          Search
        </button>
      </div>

      <div className="staff-list">
        {filteredStaffList.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffList.map((staff: any) => (
                <tr key={staff.id}>
                  <td>{staff.staffName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.contact}</td>
                  <td>{staff.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h3>Add New Staff</h3>
            <Formik
              initialValues={{
                staffName: '',
                email: '',
                contact: '',
                gender: 'Male',
              }}
              validationSchema={validationSchema}
              onSubmit={handleAddStaff}
            >
              {({ isSubmitting }) => (
                <Form className="staff-form">
                  <div className="form-group">
                    <label htmlFor="staffName">Staff Name</label>
                    <Field
                      type="text"
                      id="staffName"
                      name="staffName"
                      className="form-control"
                    />
                    <ErrorMessage name="staffName" component="div" className="error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                    />
                    <ErrorMessage name="email" component="div" className="error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact">Contact</label>
                    <Field
                      type="text"
                      id="contact"
                      name="contact"
                      className="form-control"
                    />
                    <ErrorMessage name="contact" component="div" className="error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <Field as="select" id="gender" name="gender" className="form-control">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="error" />
                  </div>

                  <button
                    type="submit"
                    className="btn"
                    disabled={isSubmitting || loading}
                  >
                    {loading ? 'Adding Staff...' : 'Add Staff'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
