const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser");
const { generateToken } = require('../utils/generateToken');

require('dotenv').config();





module.exports.registerUser = async (req, res) => {

    try {
        if (!req.body) {
            return res.status(500).json({ "error": "all fields are require" })
        }
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(500).json({ "error": "all fields are require" });
        }

        let present = await userModel.findOne({ email })
        if (present) {
            return res.status(401).send("User already present")
        }


        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, result) => {
                if (err) return res.send(err.message)
                else {
                    let user = await userModel.create({
                        name,
                        email,
                        password: result
                    })

                    let token = generateToken(user);
                    res.cookie('token', token);

                    res.send(user);
                }
            })
        })

    }
    catch (err) {
        res.send(err.message)
    }



}


module.exports.loginUser = async (req, res) => {

    try {
        if (!req.body) {
            return res.status(500).json({ "error": "all fields are require" })
        }
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).json({ "error": "all fields are require" });
        }

        let user = await userModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                     let token = generateToken(user);
                    res.cookie('token', token);
                    
                    return res.status(200).json({
                        success: true,
                        message: "Login successful",
                        user: {
                            id: user._id,
                            email: user.email
                        }
                    });

                }
                else {
                    return res.status(500).json({ "error": "something is wrong" });
                }
            })


        } else {
            res.send("register first");
        }
    } catch (err) {
        res.status(404).send(err.message)
    }


}


module.exports.logoutUser = (req,res)=>{
  res.cookie('token','')
  res.send('hey')
}