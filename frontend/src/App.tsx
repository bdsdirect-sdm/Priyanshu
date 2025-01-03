import react from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AddPatient from './components/AddPatient';
import DoctorList from './components/DoctorList';
import StaffList from './components/StaffList';
import Signup from './components/Signup'
import Header from './components/Header';
import Verify from './components/Verify'
import Login from './components/Login'
import Profile from './components/Profile'
import UpdatePassword from './components/UpdatePassword'
import AddAddress from './components/AddAddress'
import './App.css'
import Chat from './components/chat';
import Appointment from './components/Appointment';
import AppointmentList from './components/AppointmentList';
import ViewAppointment from './components/ViewAppointment';
import ViewPatient from './components/Viewpatient';
import EditPatient from './components/EditPatient';
import NotificationsList from './components/Notification';

const App: react.FC = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Signup />
    },
    {
      path: '/verify',
      element: <Verify />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      element: <Header />,
      children: [
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/notification',
          element: <NotificationsList />
        },
        {
          path: '/update-password',
          element: <UpdatePassword />
        },
        {
          path: '/patient',
          element: <PatientList />
        },
        {
          path: '/add-patient',
          element: <AddPatient />
        },
        {
          path: '/view-patient',
          element: <ViewPatient />
        },
        {
          path: '/edit-patient',
          element: <EditPatient />
        },
        {
          path: '/doctor',
          element: <DoctorList />
        },
        {
          path: '/staff',
          element: <StaffList />
        },
        {
          path: '/add-address',
          element: <AddAddress onAdd={function (newAddress: string): void {
            throw new Error('Function not implemented.');
          }} />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/chat',
          element: <Chat />
        },
        {
          path: '/appointments',
          element: <AppointmentList />,
        },
        {
          path: 'add-appointment',
          element: <Appointment />,
        },
        {
          path: '/view-appointment',
          element: <ViewAppointment />,
        }

      ]
    }
  ]
  )

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer newestOnTop={false}
        closeOnClick />
    </>
  )
}

export default App
