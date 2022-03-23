import AuthController from "./AuthController.js";
import {check} from 'express-validator'
import Router from "express";
const router = new Router()

router.post('/registration', [
    check('username', 'Username cannot be empty').notEmpty(),
    check('password', 'Password cannot be shorter than 4 symbols or longer than 10').isLength({
        min: 4,
        max: 10
    }),
], AuthController.registration)
router.post('/login', AuthController.login)
router.get('/users', AuthController.getAllUsers)

export default router