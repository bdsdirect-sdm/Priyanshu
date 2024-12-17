import { Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/title_logo.webp';
// import Socket from '../socket/socketConn';
import React, { useEffect, useState } from 'react';
// import '../Styling/Navbar.css';
import Socket from '../utils/Socket';
import { toast, ToastContentProps } from 'react-toastify';

export let Logout: any;

const socket = Socket;

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const uuid = localStorage.getItem('id');
    const [unreadcount, setUnread] = useState(0);

    useEffect(() => {

        function getNotiCount() {
            socket.emit('joinNotifRoom', { "userId": uuid });
        }

        getNotiCount();

        return () => {
            socket.off('joinNotifRoom')
        }
    }, []);

    useEffect(() => {

        socket.on('getUnreadCount', async (unread: any) => {
            console.log("huhuhu", unread);
            setUnread(unread);
        })

        socket.on('getNotification', async (notification: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | ((props: ToastContentProps<unknown>) => React.ReactNode) | null | undefined) => {
            toast.info(notification);
        })

    }, [socket])

    Logout = () => {
        localStorage.clear()
        navigate('/login');
    }

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <nav className="navbar bg-white">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="navbar-brand d-flex align-items-center">
                    <Link to="/dashboard" className="d-flex align-items-center text-decoration-none">
                        <img
                            src={`${logo}`}
                            alt="Logo"
                            height="40"
                            className="d-inline-block align-text-top"
                        />
                        <p className="mt-2 ms-2 text-dark fw-bold">EYE REFER</p>
                    </Link>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor"
                        className="bi bi-bell notification-icon position-relative" viewBox="0 0 16 16"
                        onClick={() => navigate('/notification')} >
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                    </svg>
                    {unreadcount != 0 && (
                        <span className="position-absolute top-4 start-80 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: '10px' }} >
                            {unreadcount}
                        </span>
                    )}
                </div>
                <div className="d-flex align-items-center position-relative" onClick={toggleDropdown}>
                    <img
                        src="https://via.placeholder.com/40"
                        alt="User Profile"
                        className="rounded-circle me-2"
                        height="40"
                        width="40"
                    />
                    <div className=" me-3">
                        <p className="mb-0">Hi, {firstname} {lastname}</p>
                        <p className="mb-0 small">Welcome Back</p>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-down"
                        viewBox="0 0 16 16"
                        style={{ cursor: "pointer" }}
                    >
                        <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                        />
                    </svg>
                    {/* Dropdown Menu */}
                    {dropdownVisible && (
                        <>
                            <div className="dropdown-menu show position-absolute end-0 mt-5 dropd">
                                <Link to='/profile' className="dropdown-item">
                                    Profile
                                </Link>
                                <Link to='/update-password' className="dropdown-item">
                                    Change password
                                </Link>
                                <button className="dropdown-item" onClick={Logout} >
                                    Logout
                                </button>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
