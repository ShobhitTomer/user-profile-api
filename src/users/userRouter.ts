import express from "express";
import multer from "multer";
import path from "path";
import {
  createUser,
  getUserProfile,
  loginUser,
  updateUserProfile,
} from "./userController";
import authenticate from "../middlewares/authenticate";

const userRouter = express.Router();

// Configure multer for profile picture uploads
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Authentication routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

// Profile routes (protected)
userRouter.get("/profile", authenticate, getUserProfile);
userRouter.patch(
  "/profile",
  authenticate,
  upload.single("profilePicture"),
  updateUserProfile
);

export default userRouter;
