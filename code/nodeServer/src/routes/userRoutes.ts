//module import
import express from 'express';
import {AuthController} from '../controllers/userController';
import {Request, Response, NextFunction} from 'express'

//function import from controller

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/login', AuthController.login);
router.post('/reset-password', AuthController.passwordReset);

export default router;

