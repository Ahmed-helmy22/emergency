import userModel from "../../database/models/userModel.js";
import { createToken } from "../utils/createToken.js";
import { catchErr } from "../error/catchErr.js";
import AppErr from "../error/AppErr.js";
import bcrypt from "bcryptjs";

// Signup function
export const signup = catchErr(async (req, res, next) => {
  try {
    const { email, password, phoneNumber, name, passwordConfirm, additionalPhones, sendNotification, nationalId } = req.body;

    const isExist = await userModel.findOne({
      $or: [
        { email },
        { phoneNumber },
        { nationalId }
      ]
    });

    if (isExist) 
      return next(new AppErr("Duplicate user data, please provide unique data", 400));

    const user = await userModel.create({
      email,
      password,
      phoneNumber,
      name,
      passwordConfirm,
      additionalPhones,
      sendNotification,
      nationalId
    });

    if (!user) return next(new AppErr("Error in sign up, please try again", 400));
    
    const token = createToken({ id: user._id, role: user.role, email: user.email });
    return res.status(200).json({ message: "You are signed up", token });
  } catch (error) {
    console.log(error);
  }
});

// Login function
export const login = catchErr(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new AppErr("Invalid email or password", 400));

  const token = createToken({ id: user._id, role: user.role, email: user.email });
  return res.status(200).json({ status: "success", message: "You are logged in", token });
});

// Update profile function
export const updateProfile = catchErr(async (req, res, next) => {
  
    const { name, email, nationalId, sendNotification, additionalPhones , phoneNumber } = req.body;
    
    const isExist = await userModel.findOne({
      $or: [
        { email },
        { nationalId },
        { phoneNumber }
      ],
      _id: { $ne: req.user._id } // Exclude current user
    });
    
    if (isExist) 
      return next(new AppErr("Duplicate email or national ID or Phone, please provide unique data", 400));
    
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, email, nationalId, sendNotification, additionalPhones },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return next(new AppErr("No user found with this ID", 404));
    }
    
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: updatedUser
      }
    });
});
