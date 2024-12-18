import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';

const NotificationsList: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState<null | string>(null);

    async function setNotificationSeen() {
        try {
            await api.put(`${Local.NOTIFICATION_SEEN}`, { "is_seen": 1 }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        return () => {
            setNotificationSeen();
        };
    }, []);

    const getNotifications = async () => {
        try {
            const response = await api.get(`${Local.GET_NOTIFICATION_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.notifications;
        } catch (err: any) {
            toast.error(err.response.data.message);
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notification'],
        queryFn: getNotifications,
    });

    useEffect(() => {
        if (data && data.length > 0) {
            setUserId(data[0]['notifyto']);
        }
    }, [data]);

    console.log(userId);

    if (isLoading) {
        return (
            <>
                <div className='loading-icon'>
                    <div className="spinner-border spinner text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className='me-2 fs-2'>Loading...</div>
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <div>Error: {error?.message}</div>
            </>
        );
    }

    return (
        <div>
            <h5 className='m-4'>Notifications</h5>

            <div className='bg-white ms-4 pt-5 pb-3'>
                {data.map((notif: any, index: number) => (
                    <div key={index} className={`px-5 ${notif.is_seen === 1 ? 'text-secondary' : ''}`}>
                        <p className='mb-0'>{notif.notification}</p>
                        <span className='me-2' style={{ fontSize: '12px' }}>Received 3 weeks ago</span>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsList;
