import React from "react";
import { NavLink } from "react-router-dom";
import '../styles/Sidebar.css'
import { FaHome } from "react-icons/fa";
import { MdOutlinePersonalInjury, MdOutlineMarkChatRead } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { CiStethoscope } from "react-icons/ci";
import { RiCalendar2Line } from "react-icons/ri";

const Sidebar: React.FC = () => {
    const doctype = localStorage.getItem('doctype');

    return (
        <div className="sidebar">
            <nav className="menu">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                >
                    <FaHome className="icon" />
                    <span className="menu-text">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/patient"
                    className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                >
                    <MdOutlinePersonalInjury className="icon" />
                    <span className="menu-text">Patient</span>
                </NavLink>

                <NavLink
                    to="/doctor"
                    className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                >
                    <CiStethoscope className="icon" />
                    <span className="menu-text">Doctors</span>
                </NavLink>

                <NavLink
                    to="/chat"
                    className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                >
                    <MdOutlineMarkChatRead className="icon" />
                    <span className="menu-text">Chat</span>
                </NavLink>

                {doctype === '2' && (
                    <NavLink
                        to="/staff"
                        className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                    >
                        <FaPeopleGroup className="icon" />
                        <span className="menu-text">Staff</span>
                    </NavLink>
                )}

                {doctype === '1' && (
                    <NavLink
                        to="/appointments"
                        className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                    >
                        <RiCalendar2Line className="icon" />
                        <span className="menu-text">Appointments</span>
                    </NavLink>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;
