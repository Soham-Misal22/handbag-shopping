const express = require('express')
const router = express.Router()
const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser");
const {generateToken} = require('../utils/generateToken');
const {registerUser, loginUser, logoutUser} = require('../controllers/authController')

require('dotenv').config();

router.get('/', (req, res) => {
    res.send('hey, User')
})

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

module.exports = router;