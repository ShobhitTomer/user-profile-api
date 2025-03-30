/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "node:path";
import fs from "node:fs";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
import { AuthRequest } from "../middlewares/authenticate";
import cloudinary from "../config/cloudinary";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, address, bio } = req.body;
  
  // Validation
  if (!name || !email || !password || !address) {
    const error = createHttpError(400, "Name, email, password, and address are required");
    return next(error);
  }

  // Database call to check if there exists the same email or not
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      address,
      bio: bio || "",
      profilePicture: ""
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user"));
  }

  // Token Generation JWT
  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    
    // response
    res.status(201).json({ 
      id: newUser._id, 
      accessToken: token,
      message: "User created successfully"
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  // DB call to fetch the user
  let user;
  try {
    user = await userModel.findOne({ email });
  } catch (err) {
    return next(createHttpError(500, "Error while finding the user"));
  }

  if (!user) {
    return next(createHttpError(404, "User not found"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "Email or password incorrect"));
  }

  // Create access token
  try {
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.json({ 
      id: user._id,
      accessToken: token,
      message: "Login successful" 
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing JWT token"));
  }
};

// Get the user's own profile
const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _req = req as AuthRequest;
    const userId = _req.userId;
    
    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    
    return res.json(user);
  } catch (err) {
    return next(createHttpError(500, "Error fetching user profile"));
  }
};

// Update user profile
const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;
  const userId = _req.userId;
  const { name, address, bio } = req.body;
  
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    
    // Process profile image if it exists
    let profilePictureUrl = user.profilePicture;
    
    if (req.file) {
      const imagePath = path.resolve(req.file.path);
      
      // If user already has a profile picture, delete the old one from cloudinary
      if (user.profilePicture) {
        try {
          const imageId = user.profilePicture.split('/').pop()?.split('.')[0];
          if (imageId) {
            await cloudinary.uploader.destroy(`profile-pictures/${imageId}`);
          }
        } catch (error) {
          console.log("Error deleting old profile picture:", error);
        }
      }
      
      // Upload new image
      try {
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: "profile-pictures",
        });
        profilePictureUrl = result.secure_url;
        
        // Clean up local file
        await fs.promises.unlink(imagePath);
      } catch (error) {
        return next(createHttpError(500, "Error uploading profile picture"));
      }
    }
    
    // Update user profile
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name: name || user.name,
        address: address || user.address,
        bio: bio !== undefined ? bio : user.bio,
        profilePicture: profilePictureUrl
      },
      { new: true }
    ).select("-password");
    
    return res.json({
      user: updatedUser,
      message: "Profile updated successfully"
    });
  } catch (err) {
    return next(createHttpError(500, "Error updating user profile"));
  }
};

export { createUser, loginUser, getUserProfile, updateUserProfile };