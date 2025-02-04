import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInstance';
import Local from '../../environment/env';
import SkullLoading from './SkullLoading';
import './Dashboard.css';

const AdminUser = React.lazy(() => import('./AdminUserlist'));
const AdminWave = React.lazy(() => import('./AdminWave'));
const AdminNavbar = React.lazy(() => import('./AdminNavbar'));

interface DashboardData {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalWaves: number;
}

const AdminDashboard: React.FC = () => {
    const [view, setView] = useState(1);
    const [userType, setUserType] = useState(1);
    const [isLoadingDelayed, setIsLoadingDelayed] = useState(true);

    const getValues = async (): Promise<DashboardData> => {
        try {
            const response = await api.get(`${Local.GET_VALUES}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (err: any) {
            toast.error(err.response.data.message);
            throw new Error('Failed to fetch data');
        }
    };

    const { data, error, isLoading, isError } = useQuery<DashboardData>({
        queryKey: ['dashboarddata'],
        queryFn: getValues,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingDelayed(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading && isLoadingDelayed) {
        return (
            <div className="loading-container">
                <SkullLoading />
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <p>Error: {error?.message}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <span className="dashboard-label">DASHBOARD</span>
                <h1 className="dashboard-title">Overview</h1>
            </div>
            <div>
                <div className="cards-container">
                    <div className="stat-card" onClick={() => { setUserType(1); setView(1); }}>
                        <div className="stat-card-content">
                            <span className="stat-label">Total Users</span>
                            <div className="stat-value">{data?.totalUsers || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => { setUserType(2); setView(1); }}>
                        <div className="stat-card-content">
                            <span className="stat-label">Active Users</span>
                            <div className="stat-value">{data?.activeUsers || 0}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => { setUserType(3); setView(1); }}>
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
                <Suspense fallback={<SkullLoading />}>
                    {view === 1 ? (
                        <AdminUser userType={`${userType}`} />
                    ) : (
                        <AdminWave />
                    )}
                </Suspense>
            </div>
            <Suspense fallback={<SkullLoading />}>
                <AdminNavbar />
            </Suspense>
        </div>
    );
};

export default AdminDashboard;
