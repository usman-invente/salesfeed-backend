import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const DUMMY_HASH = "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW";

const getUsers = (req, res,next)=>{
    res.status(200).send('Get Users');
}

const saveUser = async (req, res,next) => {
    try {
        const { name, email,  password, termsAccepted } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, termsAccepted });
        await user.save();

        res.status(200).json({ message: 'User saved successfully', data: { name, email, token: user.generateAuthToken() } });
    } catch (error) {
       // res.status(500).json({message: 'Error saving user', error: error.message});
       next(error);
    }
}

const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    // 1. Query the database using await User.findOne
    const user = await User.findOne({ email });

    const passwordHash = user ? user.password : DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!user || !isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password." 
      });
    }

  
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // 3. Set HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      accessToken,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (err) {
    // Print full error log in server console to identify runtime issues
    console.error("Login Controller Error:", err);
    
   next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // Clear the HTTP-only cookie by setting its expiration to the past
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // Must match the path used when the cookie was created
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("sdsdd");
    console.log("Received Refresh Token:", refreshToken);


    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Refresh token missing. Please log in again." 
      });
    }

    // Verify refresh token using REFRESH_TOKEN_SECRET
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    console.log("Decoded Refresh Token:", decoded);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User account no longer exists." 
      });
    }

    // Issue new Access Token
    const accessToken = user.generateAuthToken();

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: "Invaliddd or expired refresh token." 
    });
  }
};

export {getUsers, saveUser, login, refresh, logout};