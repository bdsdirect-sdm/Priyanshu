import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Local from '../../environment/env';
import api from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { queryClient } from '../../main';

const AdminWave: React.FC = () => {
    const [search, setSearch] = useState('');
    const [showWave, setShowWave] = useState<any>({});

    const updateWaveStatus = async (UUID: any) => {
        try {
            await api.put(`${Local.UPDATE_WAVE_STATUS}`, { UUID }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            queryClient.invalidateQueries({
                queryKey: ['waves']
            });
            queryClient.invalidateQueries({
                queryKey: ['dashboarddata']
            });
            toast.success('Wave status updated successfully');
        }
        catch (err: any) {
            toast.error(`${err.response.data.message}`);
        }
    }

    const getwaves = async () => {
        try {
            const response = await api.get(`${Local.GET_ALL_WAVES}?search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err: any) {
            toast.error(`${err.response.data.error}`);
        }
    }

    const { data: waves, isLoading, isError, error } = useQuery({
        queryKey: ['waves', search],
        queryFn: getwaves
    });

    if (isLoading) {
        return (<div>Loading...</div>);
    }

    if (isError) {
        return (
            <div>
                <p>Error: {error.message}</p>
            </div>
        )
    }

    const deleteWave = async (waveId: any) => {
        try {
            const response = await api.delete(`${Local.DELETE_WAVE}/${waveId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success(`${response.data.message}`);
            queryClient.invalidateQueries({
                queryKey: ['waves'],
            });
        }
        catch (err: any) {
            toast.error(`${err.response.data.message}`);
        }
    }

    return (
        <>

            <div>
                <div className='bg-white pt-1 pb-2'>
                    <div className='form-control ms-3 w-25 rounded-5 d-flex mt-3' >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='pt-2' >
                            <path d="M8.94286 3C10.519 3 12.0306 3.62612 13.1451 4.74062C14.2596 5.85512 14.8857 7.36671 14.8857 8.94286C14.8857 10.4149 14.3463 11.768 13.4594 12.8103L13.7063 13.0571H14.4286L19 17.6286L17.6286 19L13.0571 14.4286V13.7063L12.8103 13.4594C11.768 14.3463 10.4149 14.8857 8.94286 14.8857C7.36671 14.8857 5.85512 14.2596 4.74062 13.1451C3.62612 12.0306 3 10.519 3 8.94286C3 7.36671 3.62612 5.85512 4.74062 4.74062C5.85512 3.62612 7.36671 3 8.94286 3ZM8.94286 4.82857C6.65714 4.82857 4.82857 6.65714 4.82857 8.94286C4.82857 11.2286 6.65714 13.0571 8.94286 13.0571C11.2286 13.0571 13.0571 11.2286 13.0571 8.94286C13.0571 6.65714 11.2286 4.82857 8.94286 4.82857Z" fill="#3E5677" />
                        </svg>
                        <input type="text" name="search_friend" placeholder='search with name' className='w-100 form-control border-0 rounded-5'
                            onKeyDown={(e: any) => {
                                if (e.key == 'Enter') {
                                    setSearch(e.target.value);
                                }
                            }}
                        />
                        <i className="bi bi-arrow-clockwise fs-5 pt-1" onClick={() => {
                            setSearch('');
                        }} />
                    </div>
                </div>
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Message</th>
                            <th scope="col">Created On</th>
                            <th scope='col' >Status</th>
                            <th scope='col' >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {waves.map((wave: any) => {
                            return (
                                <tr>
                                    <td> {wave.user_wave.firstname} {wave.user_wave.lastname} </td>
                                    <td>{wave.text}</td>
                                    <td> {wave.createdAt} </td>
                                    <td>
                                        <div className="form-check form-switch">
                                            <div className='w-25 mx-auto me-3'>
                                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={() => { updateWaveStatus(wave.uuid) }} checked={wave.status} />
                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault" hidden />
                                            </div>
                                        </div>

                                    </td>
                                    <td className='d-flex justify-center '>
                                        <i className="bi bi-eye me-3 text-[#307986] hover:cursor-pointer"
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdropShowWave"
                                            onClick={() => { setShowWave(wave); }}
                                        />



                                        <i className="bi bi-trash text-[#307986] hover:cursor-pointer" onClick={() => { deleteWave(wave.uuid) }} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showWave && (
                <div className="modal fade" id="staticBackdropShowWave" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="mx-2 mt-2 rounded">
                                <div className="d-flex justify-content-between align-items-center cw-clr rounded-3">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="close-friend"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => {
                                            setShowWave({
                                                firstname: showWave?.user_wave?.firstname,
                                                lastname: showWave?.user_wave?.lastname,
                                            });
                                        }}
                                    >
                                        <circle cx="9" cy="9" r="9" fill="#DECAA5" />
                                        <line
                                            x1="5.35355"
                                            y1="4.64645"
                                            x2="14.3536"
                                            y2="13.6464"
                                            stroke="#B18D4B"
                                        />
                                        <line
                                            y1="-0.5"
                                            x2="12.7279"
                                            y2="-0.5"
                                            transform="matrix(-0.707107 0.707107 0.707107 0.707107 14 5)"
                                            stroke="#B18D4B"
                                        />
                                    </svg>
                                    <h1 className="fw-bold mx-auto cw-clr display-1 ">
                                        Details
                                    </h1>
                                </div>
                            </div>
                            <div className="photo ms-5 mb-0 pb-0  main-img-div ">
                                <div className="d-flex photo">
                                    {showWave?.user_wave?.profile_photo && (
                                        <img
                                            src={`${Local.BASE_URL}${showWave?.user_wave?.profile_photo}`}
                                            alt="User Profile"
                                            className="rounded-circle border mt-3"
                                            style={{ width: "100px", height: "100px" }}
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        />
                                    )}
                                    {!showWave?.user_wave?.profile_photo && (
                                        <img
                                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${showWave?.user_wave?.firstname} ${showWave?.user_wave?.lastname}`}
                                            alt="User Profile"
                                            className="rounded-circle border mt-3"
                                            style={{ width: "100px", height: "100px" }}
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        />
                                    )}
                                    <p className="ms-5 text-white fs-5 fw-semibold">
                                        {showWave?.user_wave?.firstname}{" "}
                                        {showWave?.user_wave?.lastname}
                                        <blockquote className=" text-white pt-0 mt-0 fw-light fs-6">
                                            {" "}
                                            {showWave?.user_wave?.email}{" "}
                                        </blockquote>
                                    </p>
                                </div>
                            </div>

                            <div className='d-flex felx-wrap ms-4 wave-msg ' >
                                <div className='d-flex flex-wrap mt-0 w-50  ' >
                                    <div className='d-flex ' >
                                        <div className='' >
                                            <p className='mb-0 fw-semibold ' >Message</p>
                                            <p className='mt-1 ms-2 text-secondary' >{showWave?.text}</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="d-flex photo border-start ">
                                    <div id="carouselExample" className="carousel slide">
                                        <div className="carousel-inner">
                                            <div className="carousel-item active border-0">
                                                <img src={`${Local.BASE_URL}${showWave?.photo}`} className="d-block pt-4" alt="wave_photo"
                                                    style={{ width: "360px", height: "170px" }}
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                />
                                            </div>
                                            {showWave.video && (
                                                <div className="carousel-item px-5" style={{ margin: '20px', padding: '10px' }}>
                                                    <video src={`${Local.BASE_URL}${showWave?.video}`} className="d-block mt-4 "
                                                        controls
                                                        style={{ width: "360px", height: "170px" }} />
                                                </div>
                                            )}
                                        </div>

                                        {showWave.video && (
                                            <>
                                                <button className="carousel-control-prev  " type="button" >
                                                    <span className="carousel-control-prev-icon bg-secondary rounded " aria-hidden="true" data-bs-target="#carouselExample" data-bs-slide="prev"></span>
                                                    <span className="visually-hidden">Previous</span>
                                                </button>
                                                <button className="carousel-control-next" type="button" >
                                                    <span className="carousel-control-next-icon bg-secondary rounded" aria-hidden="true" data-bs-target="#carouselExample" data-bs-slide="next"></span>
                                                    <span className="visually-hidden">Next</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* {editWave && (
            <div className="modal fade" id="staticBackdropEditWave" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>
        )} */}

        </>
    )
}

export default AdminWave