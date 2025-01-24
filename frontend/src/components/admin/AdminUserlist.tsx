import * as Yup from 'yup';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../utils/axiosInstance';
import Local from '../../environment/env';
import { queryClient } from '../../main';
import Button from '../../common/components/CommonButton';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export const basicValidatorSchema = Yup.object().shape({
    firstname: Yup.string().required("first name is required"),
    lastname: Yup.string().required("last name is required"),
    email: Yup.string().email("invalid email").required("email is required"),
    phone: Yup.number().typeError("Phone number must be number").min(10, "phone number must be of 10 digits"),
    address_one: Yup.string().required("address is required"),
    address_two: Yup.string().notRequired(),
    city: Yup.string().required(" City is required "),
    state: Yup.string().required(" State is required"),
    zip_code: Yup.number().typeError("Zip code must be number").
        min(6, "zip code mustbe of 6 digits").
        required("Zip code is reuired")
});

export const personalValidatorSchema = Yup.object().shape({
    dob: Yup.date().required("date of birth is required").max(new Date(), "Date of birth must be in the past"),
    gender: Yup.string().required("gender is required"),
    marital_status: Yup.string().notRequired(),
    social_security: Yup.number().typeError(" Social Security number must be in numbers ").notRequired(),
    social: Yup.string().notRequired(),
    kids: Yup.number().typeError("number of kids must be number").notRequired()
});

const AdminUser: React.FC<any> = ({ userType }) => {
    const [search, setSearch] = useState('');
    const [userUUID, setUserUUID] = useState('');
    const [activeTab, setActiveTab] = useState(2) // 1 for basic details & 2 for personal details
    const [showUser, setShowUser] = useState<any>({});
    const [editUser, setEditUser] = useState<any>({});


    const updateBasic = async (data: any) => {
        try {
            const response = await api.put(
                `${Local.BASIC_UPDATE_USER}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            toast.success(`${response.data.message}`)
            queryClient.invalidateQueries({ queryKey: ['users'] });
            return
        } catch (err: any) {
            toast.error(`${err.response.messsage}`)
        }
    }

    const updatePersonal = async (data: any) => {
        try {
            const response = await api.put(
                `${Local.PERSONAL_UPDATE_USER}`,
                { data, "userUUID": userUUID },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            toast.success(`${response.data.message}`)
            queryClient.invalidateQueries({ queryKey: ['users'] })
            return
        } catch (err: any) {
            toast.error(`${err.response.messsage}`)
        }
    }

    const updateProfileMutation = useMutation({
        mutationFn: activeTab == 1 ? updateBasic : updatePersonal,
    })

    const updateUserStatus = async (UUID: any) => {
        try {
            await api.put(`${Local.UPDATE_USER_STATUS}`, { UUID }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            queryClient.invalidateQueries({
                queryKey: ['users', 'dashboarddata']
            });

            queryClient.invalidateQueries({
                queryKey: ['users']
            });
            queryClient.invalidateQueries({
                queryKey: ['dashboarddata']
            });

            toast.success('User status updated successfully');
        }
        catch (err: any) {
            toast.error(`${err.response.data.message}`);
        }
    }

    const getusers = async () => {
        try {
            const response = await api.get(`${Local.GET_ALL_USERS}?search=${search}&userType=${userType}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err: any) {
            toast.error(`${err.response.data.message}`);
        }
    }

    const { data: users, isError, isLoading, error } = useQuery({
        queryKey: ['users', search, userType],
        queryFn: getusers
    })

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

    const updateProfileHandler = (values: any) => {
        updateProfileMutation.mutate(values)
    }

    const deleteUser = async (userId: any) => {
        try {
            const response = await api.delete(`${Local.DELETE_USER}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success(`${response.data.message}`);
            queryClient.invalidateQueries({
                queryKey: ['users'],
            })
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
                        <input type="text" name="search_friend" placeholder='search with name, email' className='w-100 form-control border-0 rounded-5'
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
                            <th scope="col">Email</th>
                            <th scope="col">Mobile</th>
                            <th scope='col' >Status</th>
                            <th scope='col' >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr>
                                <td> {user.firstname} {user.lastname} </td>
                                <td> {user.email} </td>
                                <td> {user.phone} </td>
                                <td>
                                    <div className="form-check form-switch">
                                        <div className='w-25 mx-auto me-3'>
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={() => { updateUserStatus(user?.uuid) }} checked={user.status} />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault" hidden />
                                        </div>
                                    </div>
                                </td>
                                <td className='d-flex justify-center color-primary' >
                                    <i className="bi bi-eye text-[#307986] hover:cursor-pointer"
                                        data-bs-toggle="modal"
                                        data-bs-target="#staticBackdropShowUser"
                                        onClick={() => { setShowUser(user); }} />
                                    <i className="bi bi-pen mx-3 text-[#307986] hover:cursor-pointer"
                                        data-bs-toggle="modal"
                                        data-bs-target="#staticBackdropEditUser"
                                        onClick={() => { setEditUser(user); setUserUUID(user.uuid) }} />
                                    <i className="bi bi-trash text-[#307986] hover:cursor-pointer" onClick={() => { deleteUser(user.uuid) }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {showUser && (
                <div className="modal fade" id="staticBackdropShowUser" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                            setShowUser({
                                                firstname: showUser.firstname,
                                                lastname: showUser.lastname,
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
                                    <h1 className="fw-bold ms-auto me-5 cw-clr display-1 ">
                                        Details
                                    </h1>
                                </div>
                            </div>

                            <div className="photo ms-5 mb-0 pb-0  main-img-div ">
                                <div className="d-flex photo">
                                    {showUser.profile_photo && (
                                        <img
                                            src={`${Local.BASE_URL}${showUser.profile_photo}`}
                                            alt="User Profile"
                                            className="rounded-5 border mt-4"
                                            style={{ width: "100px", height: "100px" }}
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        />
                                    )}
                                    {!showUser.profile_photo && (
                                        <img
                                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${showUser.firstname} ${showUser.lastname}`}
                                            alt="User Profile"
                                            className="rounded-5 border mt-4"
                                            style={{ width: "90px", height: "90px" }}
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        />
                                    )}
                                    <p className="ms-5 text-white fs-5 fw-semibold">
                                        {showUser.firstname} {showUser.lastname}
                                        <p className=" text-white pt-0 mt-0 fw-light fs-6">
                                            {showUser.email}
                                        </p>
                                    </p>
                                </div>
                                <div>
                                    <div className="details fw-semibold">Basic Details</div>
                                    <div className="row basic-details">
                                        <div className="col-6 ps-4 border-end border-2 text-secondary ">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="row mb-1">Name: </div>
                                                    <div className="row mb-1">Email ID: </div>
                                                    <div className="row mb-1">Mobile No.: </div>
                                                    <div className="row mb-1">Gender: </div>
                                                    <div className="row mb-1">State: </div>
                                                </div>
                                                <div
                                                    className="col-6 pe-2"
                                                    style={{
                                                        wordWrap: "break-word",
                                                        overflowWrap: "break-word",
                                                        overflow: "scroll",
                                                    }}
                                                >
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.firstname} {showUser.lastname}
                                                    </div>
                                                    <div className="row mb-1"> {showUser.email} </div>
                                                    <div className="row mb-1"> {showUser.phone} </div>
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.gender || "----"}{" "}
                                                    </div>
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.state || "----"}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-6 ps-4  ">
                                            <div className="row text-secondary ">
                                                <div className="col-6">
                                                    <div className="row mb-1">DOB: </div>
                                                    <div className="row mb-1">Social Security: </div>
                                                    <div className="row mb-1">Address: </div>
                                                    <div className="row mb-1">City: </div>
                                                    <div className="row mb-1">Zip Code: </div>
                                                </div>
                                                <div
                                                    className="col-6"
                                                    style={{
                                                        wordWrap: "break-word",
                                                        overflowWrap: "break-word",
                                                        overflow: "scroll",
                                                    }}
                                                >
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.dob || "----"}{" "}
                                                    </div>
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.social_security || "----"}{" "}
                                                    </div>
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.address_one || "----"}{" "}
                                                    </div>
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.city || "----"}{" "}
                                                    </div>
                                                    <div className="row mb-1">
                                                        {" "}
                                                        {showUser.zip_code || "----"}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {editUser && (
                <div className="modal fade" id="staticBackdropEditUser" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content p-4">

                            <div className='flex space-x-8  '>
                                <button
                                    className={`text-[#3C3D3E] pt-1 font-semibold ${activeTab === 2 ? 'border-b-4 border-[#3E5677]' : ''
                                        }`}
                                    onClick={() => {
                                        setActiveTab(2)
                                    }}
                                >
                                    Personal Details
                                </button>
                                <button
                                    className={`text-[#3C3D3E] pt-1 font-semibold ${activeTab === 1 ? 'border-b-4 border-[#3E5677]' : ''
                                        }`}
                                    onClick={() => {
                                        setActiveTab(1)
                                    }}
                                >
                                    Basic Details
                                </button>
                            </div>

                            <div>
                                {/* Basic details Form */}
                                {activeTab === 1 && (
                                    <Formik
                                        initialValues={{
                                            firstname: editUser?.firstname,
                                            lastname: editUser?.lastname,
                                            email: editUser?.email,
                                            phone: editUser?.phone,
                                            address_one: editUser?.address_one,
                                            address_two: editUser?.address_two,
                                            city: editUser?.city,
                                            state: editUser?.state,
                                            zip_code: editUser?.zip_code
                                        }}
                                        validationSchema={basicValidatorSchema}
                                        onSubmit={updateProfileHandler}
                                    >
                                        {() => (
                                            <Form className='py-4' >
                                                <div className='row mb-3'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>First Name <span className='text-danger' >*</span> </label>
                                                        <Field
                                                            type='text'
                                                            name='firstname'
                                                            className='form-control'
                                                            placeholder="Enter your first name"
                                                        />
                                                        <ErrorMessage
                                                            name='firstname'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Last Name <span className='text-danger' >*</span> </label>
                                                        <Field
                                                            type='text'
                                                            name='lastname'
                                                            className='form-control'
                                                            placeholder='Enter your last name'
                                                        />
                                                        <ErrorMessage
                                                            name='lastname'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-3'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Email <span className='text-danger' aria-disabled >*</
                                                        span> </label>
                                                        <Field
                                                            type='email'
                                                            name='email'
                                                            className='form-control'
                                                            placeholder='Enter your email'
                                                            disabled
                                                        />
                                                        <ErrorMessage
                                                            name='email'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Phone Number <span className='text-danger' >
                                                        </span> </label>
                                                        <Field
                                                            type='text'
                                                            name='phone'
                                                            className='form-control'
                                                            placeholder='Enter your phone number'
                                                            maxLength={10}
                                                        />
                                                        <ErrorMessage
                                                            name='phone'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-3'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Address One <span className='text-danger' >*</span> </label>
                                                        <Field
                                                            type='text'
                                                            name='address_one'
                                                            className='form-control'
                                                            placeholder='Enter your address'
                                                        />
                                                        <ErrorMessage
                                                            name='address_one'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Address Two</label>
                                                        <Field
                                                            type='text'
                                                            name='address_two'
                                                            className='form-control'
                                                            placeholder='Enter Other Address(if any)'
                                                        />
                                                        <ErrorMessage
                                                            name='address_two'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-4'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>City <span className='text-danger' >*</span> </label>
                                                        <Field
                                                            type='text'
                                                            name='city'
                                                            className='form-control'
                                                            placeholder='Enter your city'
                                                        />
                                                        <ErrorMessage
                                                            name='city'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>State <span className='text-danger' >*</span> </label>
                                                        <Field
                                                            type='text'
                                                            name='state'
                                                            className='form-control'
                                                            placeholder='Enter your state'
                                                        />
                                                        <ErrorMessage
                                                            name='state'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-4'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Zip Code <span className='text-danger' >*</span> </label>
                                                        <Field
                                                            type='text'
                                                            name='zip_code'
                                                            className="form-control"
                                                            maxLength={6}
                                                            placeholder="Enter Zip code of your area" />
                                                        <ErrorMessage
                                                            name='zip_code'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>

                                                </div>
                                                <div className='w-48 ms-auto' >
                                                    <Button text="Update" type="submit" data-bs-dismiss="modal" aria-label="Close" />
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                )}

                                {activeTab === 2 && (
                                    <Formik
                                        initialValues={{
                                            dob: editUser?.dob || '',
                                            gender: editUser?.gender || '',
                                            martial_status: editUser?.martial_status || '',
                                            social_security: editUser?.social_security || '',
                                            social: editUser?.social || '',
                                            kids: editUser?.kids || '',
                                        }}
                                        validationSchema={personalValidatorSchema}
                                        onSubmit={updateProfileHandler}
                                    >
                                        {() => (
                                            <Form className='py-4 me-4' >
                                                <div className='row mb-3'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>DOB <span className='text-danger' >*</span> </label>
                                                        <Field
                                                            type='date'
                                                            name='dob'
                                                            className='form-control'
                                                            placeholder="Enter your Date"
                                                            onFocus={(e: any) => e.target.showPicker?.()}
                                                        />
                                                        <ErrorMessage
                                                            name='dob'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Gender <span className='text-danger' >*</span> </label>
                                                        <Field as='select' name='gender' className='form-select'>
                                                            <option value="" disabled>Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="others">Other</option>
                                                        </Field>
                                                        <ErrorMessage
                                                            name='gender'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-3'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Martial Status </label>
                                                        <Field as='select' name='martial_status' className='form-select'>
                                                            <option value="" disabled>Select Martial Status</option>
                                                            <option value="single">Single</option>
                                                            <option value="married">Married</option>
                                                            <option value="divorced">Divorced</option>
                                                        </Field>
                                                        <ErrorMessage
                                                            name='martial status'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Social Security(Number only) <span className='text-danger' ></span> </label>
                                                        <Field
                                                            type='text'
                                                            name='social_security'
                                                            className='form-control'
                                                            placeholder='Enter your Security number'
                                                        />
                                                        <ErrorMessage
                                                            name='social_security'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-3'>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Social </label>
                                                        <Field
                                                            type='text'
                                                            name='social'
                                                            className='form-control'
                                                            placeholder='Social'
                                                        />
                                                        <ErrorMessage
                                                            name='social'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label className='form-label text-sm'>Kids (if Any)</label>
                                                        <Field
                                                            type='text'
                                                            name='kids'
                                                            className='form-control'
                                                            placeholder='Enter number of kids'
                                                        />
                                                        <ErrorMessage
                                                            name='kids'
                                                            component='div'
                                                            className='text-danger'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='w-48 ms-auto' >
                                                    <Button text="Update" type="submit" data-bs-dismiss="modal" aria-label="Close" />
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setEditUser({}); setActiveTab(2) }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </>
    )
}

export default AdminUser