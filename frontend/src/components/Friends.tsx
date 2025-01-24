import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './friend.css';
import Button from '../common/components/CommonButton';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';
import Local from '../environment/env';

const Friends: React.FC = () => {
  const navigate = useNavigate();

  const getRequests = async () => {
    try {
      const response = await api.get(`${Local.GET_REQUESTS}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.requests;
    }
    catch (err: any) {
      toast.error(err.response.data.message);
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['requests'],
    queryFn: getRequests
  })

  if (isLoading) {
    return (<div>Loading...</div>)
  }

  if (isError) {
    return (<div>Error: {error.message}</div>)
  }

  console.log(data);

  return (
    <div>
      <p className='h5 pb-3 d-flex ' >
        <svg width="24" height="25" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-4 pt-1' onClick={() => { history.back(); }}  >
          <path d="M25.3467 10.4067C25.3467 10.9899 24.9133 11.472 24.3509 11.5483L24.1946 11.5588L1.15258 11.5588C0.516294 11.5588 0.000482559 11.043 0.000482559 10.4067C0.000482559 9.82341 0.433908 9.34138 0.99625 9.26509L1.15258 9.25458L24.1946 9.25458C24.8309 9.25458 25.3467 9.77039 25.3467 10.4067Z" fill="#292929" fill-opacity="0.8" />
          <path d="M11.2588 18.8446C11.7097 19.2935 11.7112 20.023 11.2623 20.4739C10.8541 20.8838 10.2142 20.9223 9.76242 20.5886L9.63296 20.4774L0.339355 11.2237C-0.0717716 10.8144 -0.109172 10.1721 0.227171 9.72034L0.339287 9.59096L9.63289 0.335757C10.0837 -0.113233 10.8132 -0.111723 11.2622 0.339131C11.6704 0.748998 11.7062 1.38912 11.3706 1.83946L11.2588 1.96844L2.78547 10.4078L11.2588 18.8446Z" fill="#292929" fill-opacity="0.8" />
        </svg>
        Friends
      </p>

      <div className='m-2 bg-white p-3 rounded ' >
        {/* search bar */}
        <div className='d-flex flex-wrap' >
          <div className='d-flex mb-3 ' >

            <div className='form-control w-100 rounded-5 d-flex ' >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='pt-2' >
                <path d="M8.94286 3C10.519 3 12.0306 3.62612 13.1451 4.74062C14.2596 5.85512 14.8857 7.36671 14.8857 8.94286C14.8857 10.4149 14.3463 11.768 13.4594 12.8103L13.7063 13.0571H14.4286L19 17.6286L17.6286 19L13.0571 14.4286V13.7063L12.8103 13.4594C11.768 14.3463 10.4149 14.8857 8.94286 14.8857C7.36671 14.8857 5.85512 14.2596 4.74062 13.1451C3.62612 12.0306 3 10.519 3 8.94286C3 7.36671 3.62612 5.85512 4.74062 4.74062C5.85512 3.62612 7.36671 3 8.94286 3ZM8.94286 4.82857C6.65714 4.82857 4.82857 6.65714 4.82857 8.94286C4.82857 11.2286 6.65714 13.0571 8.94286 13.0571C11.2286 13.0571 13.0571 11.2286 13.0571 8.94286C13.0571 6.65714 11.2286 4.82857 8.94286 4.82857Z" fill="#3E5677" />
              </svg>
              <input type="text" name="search_friend" placeholder='search' className='w-100 form-control border-0 rounded-5' />
            </div>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 23H28V21H16V23ZM13 16V18H31V16H13ZM20 28H24V26H20V28Z" fill="#BEA370" />
            </svg>

          </div>

          <div className='ms-auto pt-1' onClick={() => {
            navigate("/app/invite-friends")
          }}  >
            <Button text="Invite Friend" type="button" />
          </div>
        </div>

        {/* Friend list */}
        <div className="row bg-white p-1 py-3 rounded">

          {(data.length > 0) && (
            data.map((request: any) => (
              <div className="col-12 col-lg-6 mb-3 ">
                <div className='d-flex pb-0 frnd-card rounded ' >

                  <div className='d-flex ' >
                    <div className='pt-1 ps-2' >
                      <img
                        src={`https://avataaars.io/?seed=${request.firstname} ${request.lastname}`}
                        alt="User Profile"
                        className="rounded-circle border"
                        style={{ width: "50px", height: "50px" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                    </div>

                    <div className='ms-3 small cmn-clr ' >
                      <p className='mb-0 mt-1 fw-bold fs-6 ' >{request.email}</p>
                      <p className='mt-0 ' > {request.firstname} {request.lastname} </p>
                    </div>

                  </div>

                  <div className='ms-auto mt-3 me-4' >
                    {(request.request_status == 1) && (
                      <p className='badge bg-success fw-medium rounded-4 px-3' >Accepted</p>
                    )}
                    {(request.request_status == 0) && (
                      <p className='badge fw-medium rounded-4 px-3 cmn-bg-pending-status' >Pending</p>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}

          {(data.length == 0) && (
            <div className='text-center mt-5' >
              <h4>You haven't invite any friend </h4>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Friends