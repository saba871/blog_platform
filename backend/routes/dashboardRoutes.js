const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { getDashboardSummary } = require('../controllers/dashboardController')
const dashboardRoutes = express.Router()

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        return res.status(403).json({ message: "Admin Access Only" })
    }
}

dashboardRoutes.get("/", protect, adminOnly, getDashboardSummary)


module.exports = { dashboardRoutes }
