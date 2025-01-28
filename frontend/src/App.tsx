import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import Sidebar1 from './components/Sidebar1';
import Signup from './components/Signup';
import Login from './components/Login';
import Sidebar2 from './components/Sidebar2';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Preferences from './components/Preferences';
import CreateWave from './components/CreateWave';
import Friends from './components/Friends';
import ChangePassword from './components/ChangePassword';
import InviteFriend from './components/InviteFriend';
// import AdminRegister from './components/admin/AdminRegister';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFound from './components/NotFound'; // 404 page
import DynamicForm from './components/DynamicForm';

const App: React.FC = () => {

  const router = createBrowserRouter([
    // {
    //   path: '/admin/register',
    //   element: <AdminRegister />
    // },
    {
      path: '/admin/login',
      element: <AdminLogin />
    },
    {
      path: '/admin/dashboard',
      element: <AdminDashboard />
    },
    {
      path: '/admin/DynamicForm',
      element: <DynamicForm />
    },
    {
      path: '/',
      element: <Sidebar1 />,
      children: [
        {
          path: '/',
          element: <Login />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/:url',
          element: <Signup />
        },
        {
          path: '/login/:url',
          element: <Login />
        }
      ]
    },
    {
      path: '/app',
      element: <Sidebar2 />,
      children: [
        {
          path: '/app/dashboard',
          element: <Dashboard />
        },
        {
          path: '/app/profile',
          element: <Profile />
        },
        {
          path: '/app/preferences',
          element: <Preferences />
        },
        {
          path: '/app/create-waves',
          element: <CreateWave />
        },
        {
          path: '/app/friends',
          element: <Friends />
        },
        {
          path: '/app/change-password',
          element: <ChangePassword />
        },
        {
          path: '/app/invite-friends',
          element: <InviteFriend />
        }
      ]
    },
    // Catch-all route for any invalid endpoint
    {
      path: '*',
      element: <NotFound />
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer newestOnTop={false} closeOnClick />
    </>
  );
};

export default App;
