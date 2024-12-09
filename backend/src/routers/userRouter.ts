import { Router } from "express";
import { registerUser, loginUser, verifyUser, getUser, getDocList, getPatientList, addPatient, addAddress, getDoctorList, updateprofile, deleteAddress, changePassword, addStaff, getStaff, addAppointment, getAppointments, getRooms, getAppointment, getPatient, updatePatient } from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";

const router = Router();

router.post("/register", signupValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.put("/verify", verifyUser);
router.get('/user', userAuthMiddleware, getUser);
router.get('/doctor-list', userAuthMiddleware, getDoctorList);
router.get('/doc-list', userAuthMiddleware, getDocList);
router.get('/patient-list', userAuthMiddleware, getPatientList);
router.put('/update-patient/:patientId', userAuthMiddleware, updatePatient);
router.get('/appointment-list', userAuthMiddleware, getAppointments);
router.get('/room-list', userAuthMiddleware, getRooms);
router.get('/view-appointment/:appointmentId', userAuthMiddleware, getAppointment);
router.get('/staff-list', userAuthMiddleware, getStaff);
router.get('/view-patient/:patientId', userAuthMiddleware, getPatient);
router.post('/add-patient', userAuthMiddleware, addPatient);
router.post('/add-address', userAuthMiddleware, addAddress);
router.delete('/delete-address', userAuthMiddleware, deleteAddress);
router.post('/update-profile', userAuthMiddleware, updateprofile);
router.post('/add-Staff', userAuthMiddleware, addStaff);
router.post('/add-appointment', userAuthMiddleware, addAppointment);
router.post("/change-password", userAuthMiddleware, changePassword);

export default router;