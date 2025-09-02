import express from 'express';
import {registerUser, loginUser, userCredits, paymentStripe} from "../controllers/userController.js";
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth, userCredits);
userRouter.post('/paystripe', userAuth, paymentStripe);



export default userRouter;

//http://localhost:4000/api/users/register
//http://localhost:4000/api/users/login