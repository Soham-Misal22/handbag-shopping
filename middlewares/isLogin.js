const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

// module.exports = async (req, res, next) => {
//     if (!req.cookies.token) {
//         res.flash('error', 'you need to login first')
//         return res.redirect('/');
//     }

//     try {
//         let decode = jwt.verify(req.cookies.token, JWT_KEY)
//         let user = await userModel.findOne({ email: decode.email }).select('-password')
//         req.user = user
//         next()
//     } catch (error) {
//         res.flash('error', 'something went wrong')
//         res.redirect('/')
//     }


// }

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ success: false, message: err.message });
  }
};

