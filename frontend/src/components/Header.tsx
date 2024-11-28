import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/title_logo.webp';
import '../styles/Header.css';
import { FaHome } from "react-icons/fa";
import { MdOutlinePersonalInjury, MdOutlineMarkChatRead } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { CiStethoscope } from "react-icons/ci";
import { RiCalendar2Line } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype: any = localStorage.getItem("doctype");
  const userFirstName = localStorage.getItem("user_firstname");
  const userLastName = localStorage.getItem("user_lastname");

  const fullName = userFirstName ? userFirstName : "User";
  const lastName = userLastName ? userLastName : "User";

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <>
      <header className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src={logo} alt="EyeRefer" className="logo-img" />
          </Link>
          <h4 className="logo-text">EYE REFER</h4>
        </div>

        <div className="header-right">
          <div className="user-actions">
            {token ? (
              <div className="dropdown">
                <button className="dropdown" aria-expanded="false">
                  <h4 className='profile-name'>Hi, {fullName} {lastName} </h4>
                  <p>Welcome Back</p><br />
                </button>
                <ul className="dropdown-menu">
                  <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                  <li><Link to="/update-password" className="dropdown-item">Change Password</Link></li>
                  <li><button className="dropdown-item" onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">Login</Link>
                <Link to="/" className="btn signup-btn">Sign-up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {token && (
        <div className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-header">
            <button className="sidebar-toggle" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
              <HiOutlineMenu className="icon" />
            </button>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link">
              <FaHome className="icon" />
              {isSidebarExpanded && "Dashboard"}
            </Link>
            <Link to="/patient" className="nav-link">
              <MdOutlinePersonalInjury className="icon" />
              {isSidebarExpanded && "Patient"}
            </Link>
            {doctype === '1' && (
              <Link to="/appointments" className="nav-link">
                <RiCalendar2Line className="icon" />
                {isSidebarExpanded && "Appointments"}
              </Link>
            )}
            <Link to="/doctor" className="nav-link">
              <CiStethoscope className="icon" />
              {isSidebarExpanded && "Doctors"}
            </Link>
            <Link to="/chat" className="nav-link">
              <MdOutlineMarkChatRead className="icon" />
              {isSidebarExpanded && "Chat"}
            </Link>
            <Link to="/staff" className="nav-link">
              <FaPeopleGroup className="icon" />
              {isSidebarExpanded && "Staff"}
            </Link>
          </nav>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Header;
