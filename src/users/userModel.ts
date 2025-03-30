import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

//users
export default mongoose.model<User>("User", userSchema);
