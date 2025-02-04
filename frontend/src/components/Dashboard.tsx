import React, { Children, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../utils/axiosInstance";
import "../components/createwave.css";
import Local from "../environment/env";
import Button from '../common/components/CommonButton';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { queryClient } from "../main";

const Dashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const [getwave, setGetwave] = useState<any>({});
  const [getfriend, setGetfriend] = useState<any>({});
  const [show, setShow] = useState(0);

  const validationSchema = Yup.object().shape({
    comment: Yup.string().required("comment is required"),
    waveId: Yup.string().required()
  });



  const getComments = async () => {
    try {
      const response = await api.get(`${Local.GET_COMMENTS}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      return response?.data?.comments;
    }
    catch (err: any) {
      toast.error(err.response.data.message);
    }
  }

  const { data: comments, isLoading: commentLoading, isError: commentisError, error: commentError } = useQuery({
    queryKey: ['comments'],
    queryFn: getComments
  });

  console.log(comments);

  const getLatestWaves = async () => {
    try {
      const response = await api.get(`${Local.GET_LATEST_WAVES}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.waves;
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["Latestwaves"],
    queryFn: getLatestWaves,
  });

  const getMyFriends = async () => {
    try {
      const response = await api.get(`${Local.GET_FRIENDS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const { data: friends, error: frienderror, isLoading: friendloading, isError: friendiserror } = useQuery({
    queryKey: ["Friends"],
    queryFn: getMyFriends,
  });


  const addComment = async (data: any) => {
    try {
      const response = await api.post(`${Local.ADD_COMMENT}`, { data }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(`${response.data.message}`);
      queryClient.invalidateQueries({
        queryKey: ["comments"]
      })
    }
    catch (err: any) {
      console.log(err.response.data.meessage);
    }
  }

  const addCommentMutation = useMutation({
    mutationFn: addComment,
  })
  if (isLoading || friendloading || commentLoading) {
    return <div>Loading...</div>;
  }

  if (isError || friendiserror || commentisError) {
    return (
      <div>
        Error: {error?.message} {frienderror?.message} {commentError?.message}
      </div>
    );
  }

  const addCommentHandle = (values: any) => {
    addCommentMutation.mutate(values);
  }

  const deleteComment = async (commentId: any) => {
    try {
      const response = await api.put(`${Local.DELETE_COMMENT}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      toast.success(`${response.data.message}`);
      queryClient.invalidateQueries({
        queryKey: ["comments"]
      });
    }
    catch (err: any) {
      console.log(err.response.data.message);
    }
  }

  return (
    <>
      <div className="m-2">
        <div>
          <div className="row bg-white p-4 rounded">
            <p className="h5 pb-3">Making Waves</p>

            {data.map((wave: any) => (
              <div
                className="col-12 col-sm-6 col-lg-4 mb-5 "
                key={wave.uuid}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdropWave"
                onClick={() => {
                  setGetwave(wave);
                }}
              >
                <div className="d-flex pb-0 border-end ">
                  <div className="d-flex ">
                    <img
                      src={
                        wave.user_wave.profile_photo
                          ? `${Local.BASE_URL}${wave.user_wave.profile_photo}`
                          : `https://avataaars.io/?svg?seed=${wave.user_wave.firstname} ${wave.user_wave.lastname}`
                      }
                      alt="User Profile"
                      className="rounded-circle border"
                      style={{ width: "50px", height: "50px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />

                    <div className="ms-3 small ">
                      <p className="mb-0 Link fw-medium fs-6 ">
                        {wave.user_wave.email}
                      </p>
                      <p className="my-0 "> {wave.text} </p>
                      <p className="m-0 Link fw-medium"> Follow </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 mb-4">
          <div className="row bg-white p-4 rounded">
            <p className="h5 pb-3">Friends</p>

            {friends.friends.map((friend: any) =>
              friend.friend_1.uuid == friends.user.uuid ? (
                <div
                  className="col-12 col-lg-6 mb-3 "
                  key={friend.uuid}
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  onClick={() => {
                    setGetfriend(friend.friend_2);
                  }}
                >
                  <div className="d-flex pb-0 frnd-card rounded ">
                    <div className="d-flex ">
                      <div className="pt-2 ps-2">
                        <img
                          src={`https://api.dicebear.com/5.x/initials/svg?seed=${friend.friend_2.firstname} ${friend.friend_2.lastname}`}
                          alt="User Profile"
                          className="rounded-circle border"
                          style={{ width: "50px", height: "50px" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        />
                      </div>

                      <div className="ms-3 small cmn-clr ">
                        <p className="mb-0 mt-1 fw-bold fs-6 ">
                          {friend.friend_2.firstname}
                          {friend.friend_2.lastname}
                        </p>
                        <p className="mt-0 "> {friend.friend_2.email} </p>
                      </div>
                    </div>

                    <div className="ms-auto mt-3 me-4">
                      <p className="badge bg-success fw-medium rounded-4 px-3">
                        Accepted
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="col-12 col-lg-6 mb-3 "
                  key={friend.uuid}
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  onClick={() => {
                    setGetfriend(friend.friend_1);
                  }}
                >
                  <div className="d-flex pb-0 frnd-card rounded ">
                    <div className="d-flex ">
                      <div className="pt-2 ps-2">
                        <img
                          src={`https://api.dicebear.com/5.x/initials/svg?seed=${friend.friend_1.firstname} ${friend.friend_1.lastname}`}
                          alt="User Profile"
                          className="rounded-circle border"
                          style={{ width: "50px", height: "50px" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        />
                      </div>

                      <div className="ms-3 small cmn-clr ">
                        <p className="mb-0 mt-1 fw-bold fs-6 ">
                          {friend.friend_1.firstname}
                          {friend.friend_1.lastname}
                        </p>
                        <p className="mt-0 "> {friend.friend_1.email} </p>
                      </div>
                    </div>

                    <div className="ms-auto mt-3 me-4">
                      <p className="badge bg-success fw-medium rounded-4 px-3">
                        Accepted
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {getfriend && (
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered ">
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
                      setGetfriend({
                        firstname: getfriend.firstname,
                        lastname: getfriend.lastname,
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
                  {getfriend.profile_photo && (
                    <img
                      src={`${Local.BASE_URL}${getfriend.profile_photo}`}
                      alt="User Profile"
                      className="rounded-5 border mt-4"
                      style={{ width: "100px", height: "100px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  {!getfriend.profile_photo && (
                    <img
                      src={`https://api.dicebear.com/5.x/initials/svg?seed=${getfriend.firstname} ${getfriend.lastname}`}
                      alt="User Profile"
                      className="rounded-5 border mt-4"
                      style={{ width: "90px", height: "90px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  <p className="ms-5 text-white fs-5 fw-semibold">
                    {getfriend.firstname} {getfriend.lastname}
                    <p className=" text-white pt-0 mt-0 fw-light fs-6">
                      {getfriend.email}
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
                            {getfriend.firstname} {getfriend.lastname}
                          </div>
                          <div className="row mb-1"> {getfriend.email} </div>
                          <div className="row mb-1"> {getfriend.phone} </div>
                          <div className="row mb-1">
                            {" "}
                            {getfriend.gender || "----"}{" "}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getfriend.state || "----"}{" "}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 ps-4  ">
                      <div className="row text-secondary ">
                        <div className="col-6">
                          <div className="row mb-1">DOB: </div>
                          <div className="row mb-1">Social Security: </div>
                          <div className="row mb-1">Address One: </div>
                          <div className="row mb-1">Address Two: </div>
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
                            {getfriend.dob || "----"}{" "}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getfriend.social_security || "----"}{" "}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getfriend.address_one || "----"}{" "}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getfriend.address_two || "----"}{" "}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getfriend.city || "----"}{" "}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getfriend.zip_code || "----"}{" "}
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

      {getwave && (
        <div
          className="modal fade"
          id="staticBackdropWave"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg ">
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
                      setGetfriend({
                        firstname: getwave?.user_wave?.firstname,
                        lastname: getwave?.user_wave?.lastname,
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
                  {getwave?.user_wave?.profile_photo && (
                    <img
                      src={`${Local.BASE_URL}${getwave?.user_wave?.profile_photo}`}
                      alt="User Profile"
                      className="rounded-circle border mt-3"
                      style={{ width: "100px", height: "100px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  {!getwave?.user_wave?.profile_photo && (
                    <img
                      src={`https://api.dicebear.com/5.x/initials/svg?seed=${getwave?.user_wave?.firstname} ${getwave?.user_wave?.lastname}`}
                      alt="User Profile"
                      className="rounded-circle border mt-3"
                      style={{ width: "100px", height: "100px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  <p className="ms-5 text-white fs-5 fw-semibold">
                    {getwave?.user_wave?.firstname}{" "}
                    {getwave?.user_wave?.lastname}
                    <p className=" text-white pt-0 mt-0 fw-light fs-6">
                      {" "}
                      {getwave?.user_wave?.email}{" "}
                    </p>
                  </p>
                </div>
              </div>

              <div className='d-flex felx-wrap ms-4 wave-msg ' >
                <div className='d-flex flex-wrap mt-0 w-50  ' >
                  <div className='d-flex ' >
                    <div className='' >
                      <p className='mb-0 fw-semibold ' >Message</p>
                      <p className='mt-1 ms-2 text-secondary' >{getwave?.text}</p>
                    </div>
                  </div>

                </div>

                <div className="d-flex photo border-start border-2 border-secondary-subtle ">
                  <img
                    src={`${Local.BASE_URL}${getwave?.photo}`}
                    alt="User Profile"
                    className=" ps-4 "
                    style={{ width: "360px", height: "150px" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                </div>

              </div>

              <div className='ms-4 comment-btn' >
                {!(show) && (
                  <div onClick={() => { setShow(1) }} >
                    <Button text="Add Comments" type="button" />
                  </div>
                )}
                {show == 1 && (
                  <div  >
                    <Formik
                      initialValues={{
                        comment: "",
                        waveId: getwave?.uuid
                      }}
                      validationSchema={validationSchema}
                      onSubmit={addCommentHandle}
                    >
                      <Form >
                        <div className="d-flex flex-wrap" >
                          <button className='btn btn-close mt-1 pt-3 me-2' onClick={() => { setShow(0) }} />
                          <Field type="text" name="comment" className='form-control border-2 w-50 ' placeholder='Enter your comment' />
                          <Field type="text" name="waveId" hidden />
                          <button type="submit" className=' ms-2 p-2 rounded btn-clr text-white border-0' >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                            </svg>
                          </button>
                        </div>
                        <div>
                          <ErrorMessage name="comment" component="div" className="text-danger ms-5" />
                        </div>
                      </Form>
                    </Formik>
                  </div>
                )}
              </div>

              <div
                className="ms-4 text-secondary me-2 overflow-auto comments "
                style={{ maxHeight: "150px" }}
              >
                {comments?.map((comment: any) => (
                  (comment?.user_comment?.uuid == friends?.user?.uuid) ? (
                    <p className="mb-0 pb-1 row">
                      <div className="col-10" >
                        <b>Jasmine : </b>wefgkweimf
                      </div>
                      <div className="col-2 p-0" >
                        <div className="text-primary" >
                          <span > Edit </span> | <span > Delete </span>
                        </div>
                      </div>
                    </p>
                  ) : (
                    <p className="mb-0 pb-1">
                      <b>Jasmdfgrine : </b>wefgkweimf
                    </p>)
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
