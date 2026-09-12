require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogPostRoutes = require("./routes/blogPostRoutes");
const { commentsRoutes } = require("./routes/commentsRoutes");
const { dashboardRoutes } = require("./routes/dashboardRoutes");
const { aiRoutes } = require("./routes/aiRoutes");

const app = express();

// ნებადართული დომენების სია
const allowedOrigins = ["http://localhost:5173"];
// "https://blog-platform-liard-two.vercel.app/", 
// CORS-ის კონფიგურაცია
app.use(
    cors({
        origin: function (origin, callback) {
            // !origin საჭიროა Postman-ისთვის და სერვერული მოთხოვნებისთვის, რომლებსაც არ აქვთ origin ჰედერი
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }),
);

// connect database
connectDB();

// middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", blogPostRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/dashboard-summary", dashboardRoutes);
app.use("/api/ai", aiRoutes);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));
