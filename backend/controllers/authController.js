const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = userId => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// @desc register a new user
// @route POST api/auth/register
// @access Public

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, profileImageUrl, bio, adminAccessToken } = req.body

        const userExsists = await User.findOne({ email })

        if (userExsists) {
            return res.status(400).json({ message: 'User Already Exsists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Admin if correct token is provided, otherwise Member
        let role = 'member'

        if (adminAccessToken && adminAccessToken === process.env.ADMIN_ACCESS_TOKEN) {
            role = 'admin'
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            bio,
            role,
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            bio: user.bio,
            role: user.role,
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// @desc logIn user
// @route POST api/auth/login
// @access Public

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(500).json({ message: 'Invalid Email or Password' })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Email or Password' })
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// @desc User Profile
// @route POST api/auth/profile
// @access Private(requires JWT)

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

module.exports = { registerUser, loginUser, getUserProfile }
