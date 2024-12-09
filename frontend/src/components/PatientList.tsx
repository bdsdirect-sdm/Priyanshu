// import React, { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Local } from '../environment/env';
// import api from '../api/axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import '../styles/PatientList.css';

// const PatientList: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const doctype = localStorage.getItem('doctype');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;
//   const [sortConfig, setSortConfig] = useState({
//     key: '',
//     direction: 'asc' as 'asc' | 'desc',
//   });

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//     }
//   }, [token, navigate]);

//   const fetchPatient = async () => {
//     try {
//       const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return response.data;
//     } catch (err) {
//       toast.error(`${err}`);
//     }
//   };

//   const { data: Patients, error, isLoading, isError } = useQuery({
//     queryKey: ['patient'],
//     queryFn: fetchPatient,
//   });

//   const handleSearch = () => {
//     if (Patients?.patientList) {
//       setFilteredPatients(
//         Patients.patientList.filter((patient: any) =>
//           `${patient.firstname} ${patient.lastname}`
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase())
//         )
//       );
//       setCurrentPage(1); // Reset to the first page on new search
//     }
//   };

//   useEffect(() => {
//     if (Patients?.patientList && searchQuery === '') {
//       setFilteredPatients(Patients.patientList);
//     }
//   }, [searchQuery, Patients]);

//   const handleSort = (key: string) => {
//     let direction: 'asc' | 'desc' = 'asc';

//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }

//     setSortConfig({
//       key,
//       direction,
//     });
//   };

//   // Sorting logic
//   const sortedPatients = React.useMemo(() => {
//     if (!filteredPatients) return [];
//     let sortedData = [...filteredPatients];

//     if (sortConfig.key) {
//       sortedData = sortedData.sort((a, b) => {
//         const aValue = a[sortConfig.key];
//         const bValue = b[sortConfig.key];

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return sortedData;
//   }, [filteredPatients, sortConfig]);

//   if (isLoading) {
//     return (
//       <>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </>
//     );
//   }

//   if (isError) {
//     return (
//       <>
//         <div className="text-danger">Error: {error.message}</div>
//       </>
//     );
//   }

//   // Pagination logic
//   const totalPatients = sortedPatients.length;
//   const totalPages = Math.ceil(totalPatients / pageSize);
//   const startIndex = (currentPage - 1) * pageSize;
//   const paginatedPatients = sortedPatients.slice(startIndex, startIndex + pageSize);

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleAddPatient = () => {
//     navigate('/add-patient');
//   };

//   return (
//     <div className="patient-list-container">
//       <div className="header-container-patientlist">
//         <p className="heading-patient">Referred Patient</p>

//         {/* Conditionally render the button based on doctype */}
//         {doctype === '2' && (
//           <button className="add-patient-button" onClick={handleAddPatient}>
//             Refer Patient
//           </button>
//         )}
//       </div>

//       <div className="search-container">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search by name..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button className="search-button" onClick={handleSearch}>
//           Search
//         </button>
//       </div>

//       <table className="table">
//         <thead>
//           <tr>
//             <th scope="col" onClick={() => handleSort('firstname')}>
//               Patient Name
//               {sortConfig.key === 'firstname' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
//             </th>
//             <th scope="col" onClick={() => handleSort('disease')}>
//               Disease
//               {sortConfig.key === 'disease' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
//             </th>
//             <th scope="col" onClick={() => handleSort('referedby')}>
//               Refer by
//               {sortConfig.key === 'referedby' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
//             </th>
//             <th scope="col" onClick={() => handleSort('referedto')}>
//               Refer to
//               {sortConfig.key === 'referedto' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
//             </th>
//             <th scope="col" onClick={() => handleSort('referback')}>
//               Refer back
//               {sortConfig.key === 'referback' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
//             </th>
//             <th scope="col" onClick={() => handleSort('referalstatus')}>
//               Status
//               {sortConfig.key === 'referalstatus' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
//             </th>
//             <th scope="col">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedPatients.map((patient: any, index: number) => (
//             <tr key={index}>
//               <td>{patient.firstname} {patient.lastname}</td>
//               <td>{patient.disease}</td>
//               <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
//               <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
//               <td>{patient.referback ? 'Yes' : 'No'}</td>
//               <td>{patient.referalstatus ? 'Completed' : 'Pending'}</td>
//               <td>
//                 <div className='action'>
//                   <div>

//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       fill="currentColor"
//                       className="bi bi-eye text-success"
//                       viewBox="0 0 16 16"
//                       onClick={() => {
//                         localStorage.setItem('patientId', patient.uuid);
//                         navigate('/view-patient');
//                       }}
//                     >
//                       <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
//                       <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
//                     </svg>
//                   </div>
//                   <div>

//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       fill="currentColor"
//                       className="bi bi-pencil text-warning"
//                       viewBox="0 0 16 16"
//                       onClick={() => {
//                         localStorage.setItem('patientId', patient.uuid);
//                         navigate('/edit-patient');
//                       }}
//                     >
//                       <path d="M12.146 0L16 3.854l-2.292 2.292L9.854 2.292 7.707 0 5.854 2.146 10.854 7.146 13.146 4.854l1.354-1.354L12.146 0z" />
//                       <path d="M0 12.5V16h3.5l8-8L8.146 4.354l-8 8H0z" />
//                     </svg>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination controls */}
//       <div className="pagination-container">
//         <button
//           className="page-nav"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           &lt;
//         </button>
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index}
//             className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
//             onClick={() => handlePageChange(index + 1)}
//           >
//             {index + 1}
//           </button>
//         ))}
//         <button
//           className="page-nav"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           &gt;
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PatientList;
////////////////////////////////////////
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/PatientList.css';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const doctype = localStorage.getItem('doctype');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc' as 'asc' | 'desc',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  const { data: Patients, error, isLoading, isError } = useQuery({
    queryKey: ['patient'],
    queryFn: fetchPatient,
  });

  const handleSearch = () => {
    if (Patients?.patientList) {
      setFilteredPatients(
        Patients.patientList.filter((patient: any) =>
          `${patient.firstname} ${patient.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
      setCurrentPage(1); // Reset to the first page on new search
    }
  };

  useEffect(() => {
    if (Patients?.patientList && searchQuery === '') {
      setFilteredPatients(Patients.patientList);
    }
  }, [searchQuery, Patients]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({
      key,
      direction,
    });
  };

  // Sorting logic
  const sortedPatients = React.useMemo(() => {
    if (!filteredPatients) return [];
    let sortedData = [...filteredPatients];

    if (sortConfig.key) {
      sortedData = sortedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedData;
  }, [filteredPatients, sortConfig]);

  if (isLoading) {
    return (
      <>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="text-danger">Error: {error.message}</div>
      </>
    );
  }

  // Pagination logic
  const totalPatients = sortedPatients.length;
  const totalPages = Math.ceil(totalPatients / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPatients = sortedPatients.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddPatient = () => {
    navigate('/add-patient');
  };

  // Handle the Enter key press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="patient-list-container">
      <div className="header-container-patientlist">
        <p className="heading-patient">Referred Patient</p>

        {/* Conditionally render the button based on doctype */}
        {doctype === '2' && (
          <button className="add-patient-button" onClick={handleAddPatient}>
            Refer Patient
          </button>
        )}
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}  // Add this to handle Enter key
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col" onClick={() => handleSort('firstname')}>
              Patient Name
              {sortConfig.key === 'firstname' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
            <th scope="col" onClick={() => handleSort('disease')}>
              Disease
              {sortConfig.key === 'disease' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
            <th scope="col" onClick={() => handleSort('referedby')}>
              Refer by
              {sortConfig.key === 'referedby' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
            <th scope="col" onClick={() => handleSort('referedto')}>
              Refer to
              {sortConfig.key === 'referedto' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
            <th scope="col" onClick={() => handleSort('referback')}>
              Refer back
              {sortConfig.key === 'referback' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
            <th scope="col" onClick={() => handleSort('referalstatus')}>
              Status
              {sortConfig.key === 'referalstatus' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPatients.map((patient: any, index: number) => (
            <tr key={index}>
              <td>{patient.firstname} {patient.lastname}</td>
              <td>{patient.disease}</td>
              <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
              <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
              <td>{patient.referback ? 'Yes' : 'No'}</td>
              <td>{patient.referalstatus ? 'Completed' : 'Pending'}</td>
              <td>
                <div className='action'>
                  <div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-eye text-success"
                      viewBox="0 0 16 16"
                      onClick={() => {
                        localStorage.setItem('patientId', patient.uuid);
                        navigate('/view-patient');
                      }}
                    >
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </svg>
                  </div>
                  <div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil text-warning"
                      viewBox="0 0 16 16"
                      onClick={() => {
                        localStorage.setItem('patientId', patient.uuid);
                        navigate('/edit-patient');
                      }}
                    >
                      <path d="M12.146 0L16 3.854l-2.292 2.292L9.854 2.292 7.707 0 5.854 2.146 10.854 7.146 13.146 4.854l1.354-1.354L12.146 0z" />
                      <path d="M0 12.5V16h3.5l8-8L8.146 4.354l-8 8H0z" />
                    </svg>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination-container">
        <button
          className="page-nav"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="page-nav"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PatientList;
