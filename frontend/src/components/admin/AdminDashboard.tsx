import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInstance';
import Local from '../../environment/env';
import AdminUser from './AdminUserlist';
import AdminWave from './AdminWave';
import AdminNavbar from './AdminNavbar';
import './Dashboard.css';

const AdminDashboard: React.FC = () => {
    const [view, setView] = React.useState(1);
    const [userType, setUsertype] = React.useState(1);

    const getValues = async () => {
        try {
            const response = await api.get(`${Local.GET_VALUES}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (err: any) {
            toast.error(err.response.data.message);
        }
    };

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['dashboarddata'],
        queryFn: getValues,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return (
            <div>
                <p>Error: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <AdminNavbar />
            <div className="dashboard-header">
                <span className="dashboard-label">DASHBOARD</span>
                <h1 className="dashboard-title">Overview</h1>
            </div>
            <div>
                <div className="cards-container">
                    <div className="stat-card" onClick={() => { setUsertype(1); setView(1); }}>
                        <div className="stat-card-content">
                            <span className="stat-label">Total Users</span>
                            <div className="stat-value">{data?.totalUsers || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => { setUsertype(2); setView(1); }}>
                        <div className="stat-card-content">
                            <span className="stat-label">Active Users</span>
                            <div className="stat-value">{data?.activeUsers || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => { setUsertype(3); setView(1); }}>
                        <div className="stat-card-content">
                            <span className="stat-label">Inactive Users</span>
                            <div className="stat-value">{data?.inactiveUsers || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => setView(2)}>
                        <div className="stat-card-content">
                            <span className="stat-label">Total Waves</span>
                            <div className="stat-value">{data?.totalWaves || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {view === 1 ? (
                    <AdminUser userType={`${userType}`} />
                ) : (
                    <AdminWave />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
