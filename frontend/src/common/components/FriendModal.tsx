import React from 'react'
import Local from '../../environment/env';
import '../../styling/createwave.css';

// data-bs-dismiss="modal" aria-label="Close"

const FriendModal:React.FC<any> = ({friend}) => {
    console.log("wewfijeu", friend);
  return (
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" >
            <div className="mx-2 mt-2 rounded">
                <div className="d-flex justify-content-between align-items-center cw-clr rounded-top-2">
                <h1 className="fw-bold ms-auto me-5 cw-clr display-1 ">Details</h1>
                </div>
            </div>

            <div className="photo ms-5 mb-0 main-img-div ">
                <div className="d-flex photo  ">
                {(friend.profile_photo) && (
                <img
                    src={`${Local.BASE_URL}${friend.profile_photo}`}
                    alt="User Profile"
                    className="rounded-circle border"
                    style={{ width: "100px", height: "100px" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                />
                )}
                {!(friend.profile_photo) && (
                <img
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${friend.firstname} ${friend.lastname}`}
                    alt="User Profile"
                    className="rounded-circle border"
                    style={{ width: "100px", height: "100px" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                />
                )}
                    <p className="ms-4 text-white fs-5 fw-semibold">
                        {friend.firstname} {friend.lastname}
                        <p className=' text-white pt-0 mt-0 fw-light fs-6' >{friend.email}</p>
                    </p>
                
            </div>
            </div>
            <button className='btn-close' data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
    </div>

  )
}

export default FriendModal