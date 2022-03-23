import UserModel from './models/UserModel.js'
import RoleModel from './models/RoleModel.js'
import {validationResult} from "express-validator";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {secretKey} from "./config.js";

const generateAccessToken = (id, roles) => {
    const payload = {id, roles}
    return jwt.sign(payload, secretKey.secret, {expiresIn: '2h'})
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)

            if(!errors.isEmpty()) {
                return res.status(400).json({message: errors})
            }

            const {username, password} = req.body
            const candidate = await UserModel.findOne({username})

            if(candidate) {
                return res.status(400).json({message: 'username must be unique'})
            }

            const hashedPassword = bcrypt.hashSync(password, 7);
            const userRole = await RoleModel.findOne({value: 'ADMIN'})
            const user = new UserModel({username, password: hashedPassword, roles: [userRole.value]})
            await user.save()

            return res.json({message: 'user successfully registered'})
        } catch (e) {
            return res.status(400).json({message: 'there is some trouble in registration'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const validatedUser = await UserModel.findOne({username})

            if(!validatedUser) {
                return res.status(400).json({message: `User ${username} not found`})
            }

            const validPassword = bcrypt.compareSync(password, validatedUser.password)

            if(!validPassword) {
                return res.status(400).json({message: 'Password is incorrect'})
            }

            const token = generateAccessToken(validatedUser._id, validatedUser.roles)
            return res.json({token})
        } catch (e) {
            return res.status(400).json({message: e.message})
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find()
            return res.json(users)
        } catch (e) {
            return res.status(400).json({message:'there is some trouble by getting users'})
        }
    }
}

export default new AuthController()