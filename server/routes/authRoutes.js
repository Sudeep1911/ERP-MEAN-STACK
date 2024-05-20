import express from 'express';
import {login,employees,stock,profile,updateprofile,deleteemployee,addemployee} from '../controllers/authController.js';
const router = express.Router();

// Route for user login
router.post('/login', login);
router.get('/employees',employees);
router.get('/stock',stock);
router.post('/profile',profile)
router.post('/updateprofile',updateprofile),
router.post('/deleteemployee',deleteemployee),
router.post('/addemployee',addemployee)

export default router;
