import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import * as Yup from 'yup';
import '../styles/Verify.css';
import { useEffect } from 'react';

const Verify: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('OTP')) {
            navigate('/login');
        } else {
            toast.info("OTP sent Successfully");
        }

        return () => {
            localStorage.removeItem('OTP');
        };
    }, [navigate]);

    const OTP: any = localStorage.getItem("OTP");
    const email: any = localStorage.getItem("email");

    const verifyUser = async () => {
        const response = await api.put(`${Local.VERIFY_USER}`, { email });
        return response;
    };

    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            .required("OTP is required")
            .test("OTP Matched", "OTP Mismatch", (value: string) => {
                return value === OTP;
            })
    });

    const verifyMutation = useMutation({
        mutationFn: verifyUser
    });

    const handleSubmit = (values: any) => {
        if (values.otp === OTP) {
            toast.success("OTP Matched");
            verifyMutation.mutate(email);
            navigate('/login');
        } else {
            toast.error("Invalid OTP");
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-left">
                <div className="eye-refer">
                    <img src="3716f6b2e790fb345b25.png" alt="Eye Refer" className="eye-refer-image" />
                </div>
            </div>

            <div className="verify-right">
                <div className="verify-form">
                    <Formik
                        initialValues={{
                            otp: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form>
                                <div className="form-group">
                                    <div className='verify-heading'><h2>Verify otp</h2></div>
                                    <label>OTP</label>
                                    <Field type="text" name="otp" className="form-control" />
                                    <ErrorMessage name="otp" component="div" className="text-danger" />
                                </div>
                                <br />
                                <button type="submit" className='btn btn-outline-dark'>
                                    Submit
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <footer className="footer">
                <p>@2024 Eye Refer</p>
            </footer>
        </div>
    );
};

export default Verify;
