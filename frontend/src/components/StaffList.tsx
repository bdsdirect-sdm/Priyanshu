import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/Staff.css';

const Staff: React.FC = () => {
  const navigate = useNavigate();

  const [staffName, setStaffName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        params: {
          search: searchQuery,
        },
      });

      if (response.data.success) {
        setStaffList(response.data.staff);
      } else {
        toast.error(response.data.message || 'Failed to fetch staff list');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, [searchQuery]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to add staff.');
      navigate('/login');
      return;
    }

    const staffData = {
      staffName,
      email,
      contact,
      gender,
    };

    try {
      setLoading(true);
      const response = await api.post('/add-staff', staffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Staff added successfully');
        setStaffName('');
        setEmail('');
        setContact('');
        setGender('Male');
        fetchStaffList();
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

  const handleSearch = () => {
    fetchStaffList();
  };

  return (
    <div className="staff-form-container">

      <div className='heading-dashboard'>
        <h3>Staff list</h3>
        <button className="btn-color" onClick={handleOpenModal}>
          Add Staff
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="form-control"
          placeholder="Search staff by name, email, or contact"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn-search"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>


      <h3>Staff List</h3>
      <div className="staff-list">
        {staffList.length === 0 ? (
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
              {staffList.map((staff: any) => (
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
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h3>Add New Staff</h3>
            <form onSubmit={handleAddStaff} className="staff-form">
              <div className="form-group">
                <label htmlFor="staffName">Staff Name</label>
                <input
                  type="text"
                  id="staffName"
                  className="form-control"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Contact</label>
                <input
                  type="text"
                  id="contact"
                  className="form-control"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading ? 'Adding Staff...' : 'Add Staff'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;

