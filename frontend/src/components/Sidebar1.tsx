import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import './sidebar.css'

const Sidebar1: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/app/dashboard');
    }
  }, []);

  return (
    <>
      <div className='row w-100'>
        <img src='/src/assets/images/common_side.webp' className='sideimg col' alt="Side Image 1" />

        <div className='col m-0' >
          <Outlet />
        </div>
      </div>
      <div className='row foot'>
        <p className='border border-1 text-center text-secondary foot py-2 mb-0' > &copy; 2023 DR. Palig. All rights reserved. </p>
      </div>
    </>
  )
}

export default Sidebar1