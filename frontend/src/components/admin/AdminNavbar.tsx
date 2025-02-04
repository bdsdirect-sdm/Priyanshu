import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../utils/axiosInstance'
import Local from '../../environment/env'

const AdminNavbar: React.FC = () => {
    const navigate = useNavigate()

    const logout = async (): Promise<any> => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('No admin token found, please log in again.');
            return;
        }

        try {
            const response = await api.put(`${Local.ADMIN_LOGOUT}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success(`${response.data.message}`);

            localStorage.clear();

            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            navigate('/admin/login');
        } catch (err: any) {
            toast.error(`${err?.response?.data?.message || 'Logout failed. Please try again later.'}`);
        }
    };


    return (
        <nav className="navbar bg-secondary-subtle">
            <div className="container-fluid">
                <button className="btn btn-outline-logout btn-sm me-3" type="button" onClick={() => logout()}>
                    Logout
                </button>


            </div>
        </nav>
    )
}

export default AdminNavbar