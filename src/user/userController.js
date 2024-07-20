import userModel from "../../database/models/userModel.js";
import AppErr from "../error/AppErr.js";
import { catchErr } from "../error/catchErr.js";

export const updateMe = catchErr(async (req, res, next) => {
  const { name, phoneNumber } = req.body;
  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { name, phoneNumber },
    { new: true, runValidators: true }
  );
  if (!user) next(new AppErr("you are not logged in , >> /users/login", 401));
  return res.status(200).json({
    status: "sucsess",
    data: {
      user,
    },
  });
});

export const deleteMe = catchErr(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.user.id);
  if (!user) next(new AppErr("you are not logged in , >> /login", 401));
  return res.status(200).json({
    status: "sucsess your account is deleted now ",
  });
});

export const getMe = catchErr(async (req, res, next) => {
  const user = await userModel
    .findById(req.user.id)
    .select("-__v -verifyEmail -password");
  if (!user) next(new AppErr("you are not logged in , >> /users/login", 401));
  return res.status(200).json({
    status: "sucsess",
    user,
  });
});

export const updateMyPassword = catchErr(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const user = await userModel.findById(req.user.id);
  if (!user) next(new AppErr("you are not logged in , >> /users/login", 401));
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  return res.status(404).json({
    status: "success",
    message: "password updated",
  });
});

export const softDelete = catchErr(async (req, res, next) => {
  if (!req.params.softDelete == "diactivate")
    next("please perform diactivte action properly", 400);
  const user = await userModel.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  if (!user) next(new AppErr("you are not logged in , >> /users/login", 401));
  return res.status(200).json({
    status: "sucsess",
    user,
  });
});
