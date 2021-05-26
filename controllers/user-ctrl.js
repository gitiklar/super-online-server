const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || '0a6b944d-d2fb-46fc-a85e-0295c986cd9f'


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
   
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

const signUp = async (req , res) => {
    try {
        const { username, email, password, role } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, email, password: hashedPassword, role: role });
        const accessToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1H" });
        await newUser.save();
        res.status(200).json({ status: 200, type: 'success' , message: 'User successfully added!' , data: newUser, accessToken });
    } catch(err) {
        if(err.keyValue && err.keyValue.email) {
            res.status(400).json({ status: 400, type: 'info' , message: 'Email already exists!' });
        }
        else {
            res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
        }
    }
}

const login = async (req , res) => {
    try {
        const { email , password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            res.status(401).json({ status: 401 , type: 'error' , message: 'The email is incorrect' });
        } else  {
            const validPassword = await validatePassword(password, user.password);
            if(!validPassword) {
                res.status(401).json({ status: 401 , type: 'error' , message: 'The password is incorrect' });
            }
        }
        // change to 10 
        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1H' });
        await User.findByIdAndUpdate(user._id, { accessToken });
        res.status(200).json({ status: 200 , user , accessToken });
    } catch(err) {
        res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
    }
}

const getUser = async (req , res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
           return res.status(401).json({ status: 401 , type: 'error' , message: 'User not found' });
        }
        res.status(200).json({ status: 200 , user });
    } catch(err) {
        res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
    }
}

module.exports = {
    signUp,
    login,
    getUser,
}