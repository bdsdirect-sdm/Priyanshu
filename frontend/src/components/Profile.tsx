import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import api from '../api/axiosInstance';
import '../styles/Profile.css';
import AddAddress from './AddAddress';

const getUser = async (token: string) => {
  try {
    const response = await api.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    toast.error("Failed to fetch user data");
    throw new Error(err?.message || "User data fetch failed");
  }
};

const deleteAddress = async (token: string, addressUuid: string) => {
  try {
    const response = await api.delete(`/delete-address/${addressUuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    toast.error("Failed to delete address");
    throw new Error(err?.message || "Address deletion failed");
  }
};

const Profile: React.FC = () => {
  const token = localStorage.getItem('token');
  console.log(token);

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      getUser(token)
        .then((data) => {
          console.log('Fetched User:', data.user);
          setUser(data.user);
          setFirstname(data.user.firstname);
          setLastname(data.user.lastname);
          setPhone(data.user.phone);
          setAddress(data.user.Addresses || []);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, [token]);

  const handleSaveChanges = () => {
    if (firstname && lastname && phone) {
      localStorage.setItem("user_firstname", firstname);
      localStorage.setItem("user_lastname", lastname);
      const updatedUser = { firstname, lastname, phone };
      api.post('/update-profile', updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          toast.success("Profile updated successfully");
          setIsEditing(false);
          setUser((prevUser: any) => ({
            ...prevUser,
            firstname,
            lastname,
            phone,
          }));
          location.reload();
        })
        .catch((err) => {
          toast.error(`Error updating profile: ${err.message}`);
        });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleDeleteAddress = () => {
    if (addressToDelete && token) {
      deleteAddress(token, addressToDelete)
        .then(() => {
          setAddress(prevAddresses => prevAddresses.filter(addr => addr.uuid !== addressToDelete));
          toast.success("Address deleted successfully");
          setAddressToDelete(null);
        })
        .catch((err) => {
          toast.error(`Error deleting address: ${err.message}`);
        });
    }
  };

  const openDeleteConfirmation = (addressUuid: string) => {
    setAddressToDelete(addressUuid);
  };

  const closeDeleteConfirmation = () => {
    setAddressToDelete(null);
  };

  const handleAddAddress = (newAddress: any) => {
    setAddress(prevAddress => [...prevAddress, newAddress]);
    setShowModal(false);
    toast.success("Address added successfully");
    location.reload();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <p className='fw-bold'>Profile</p>

      <div className="profile-header">
        <div className='name'>
          <img
            src={user.profileImage || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-image"
          /><p className='name2'>{user.firstname} {user.lastname}</p>
        </div>
        <div>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      </div>

      <div className="profile-info">
        <div>
          <strong>Name:</strong>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
              />
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          ) : (
            `${user.firstname} ${user.lastname}`
          )}
        </div>

        <div>
          <strong>Phone:</strong>
          {isEditing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
          ) : (
            user.phone
          )}
        </div>

        <div>
          <strong>Email:</strong>
          <div>{user.email}</div>
        </div>
      </div>
      <div className='btn-add-address'>
        <button onClick={() => setShowModal(true)}>Add Address</button>
      </div>

      {isEditing && (
        <div className="profile-actions">
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}

      <div className="address-section">
        <h3>Address Information</h3>
        {address.length === 0 ? (
          <p>No addresses added yet.</p>
        ) : (
          <ul>
            {address.map((addr: any, index: number) => (
              addr && addr.street && addr.city && addr.state && addr.pincode ? (
                <li key={index}>
                  {addr.street}<br /> {addr.city}<br />{addr.state}<br />{addr.pincode}
                </li>
              ) : (
                <li key={index}></li>
              )
            ))}
          </ul>
        )}

      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAddress onAdd={handleAddAddress} />
        </Modal.Body>
      </Modal>

      <Modal show={addressToDelete !== null} onHide={closeDeleteConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this address?</p>
          <Button variant="danger" onClick={handleDeleteAddress}>Delete</Button>
          <Button variant="secondary" onClick={closeDeleteConfirmation}>Cancel</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
