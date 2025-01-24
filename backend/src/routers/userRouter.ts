import { Router } from "express";
import {
    userLogin, userList, Register, addorUpdatePreference, getUserPreference,
    inviteFriend, updateProfilePhoto, updateUser, updateUserPassword,
    createWave,
    getMyWaves,
    getRequests,
    getLatestWaves,
    getComments,
    addComment,
    deleteComment,
    updateComment,
    updateProfile,
    registerAdmin,
    adminLogin,
    getCounts,
    adminLogout,
    editWavestatus,
    editUserstatus,
    updateBasicUser,
    updatePersonalUser,
    getAllUsers,
    getAllwaves,
    deleteWave,
    deleteUser
} from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import { uploadWave } from "../utils/uploadWave";

const router = Router();

router.post('/login', userLogin);
router.post('/admin-login', adminLogin);
router.post('/signup', Register);
router.post('/admin-register', registerAdmin);
router.post('/addwave', userAuthMiddleware, uploadWave.single('photo'), createWave);
router.post('/invite-friend', userAuthMiddleware, inviteFriend);
router.post('/updatepreference', userAuthMiddleware, addorUpdatePreference);
router.post('/updateprofile', userAuthMiddleware, updateProfile);
router.post('/updateUser', userAuthMiddleware, updateUser);

router.post('/addcomment', userAuthMiddleware, addComment);

router.get('/getmywave', userAuthMiddleware, getMyWaves);
router.get('/getrequests', userAuthMiddleware, getRequests);
router.get('/getlatestwaves', userAuthMiddleware, getLatestWaves);
router.get('/getcomments', userAuthMiddleware, getComments);
router.get('/getpreference', userAuthMiddleware, getUserPreference);
router.get('/getfriendlist', userAuthMiddleware, userList);
// router.get('/getdata', userAuthMiddleware, getCounts);

router.put('/updatepassword', userAuthMiddleware, updateUserPassword);
router.put('/editcomment', userAuthMiddleware, updateComment);
router.put('/deletecomment/:commentId', userAuthMiddleware, deleteComment);
///////////
// adminroutes
router.put('/adminlogout', userAuthMiddleware, adminLogout);
router.put('/editwavestatus', userAuthMiddleware, editWavestatus);
router.put('/edituserstatus', userAuthMiddleware, editUserstatus);
router.put('/editadminbasicuser', userAuthMiddleware, updateBasicUser);
router.put('/editadminpersonaluser', userAuthMiddleware, updatePersonalUser);

router.get('/allusers', userAuthMiddleware, getAllUsers);
router.get('/allwaves', userAuthMiddleware, getAllwaves);
router.get('/getdata', userAuthMiddleware, getCounts);

router.delete('/deletewave/:UUID', userAuthMiddleware, deleteWave);
router.delete('/deleteuser/:UUID', userAuthMiddleware, deleteUser);
export default router;