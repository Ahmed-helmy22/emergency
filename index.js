import Express from "express";
import connection from "./database/connection.js";
import authRoute from "./src/auth/authRoute.js";
import userRoute from "./src/user/userRoutes.js";
import emergencyRoute from "./src/emergency/emergencyRoutes.js";
import { errorController } from "./src/error/errorController.js";
import cloudinary from "cloudinary"
import * as dotenv from "dotenv";
dotenv.config();
const app = Express();
app.use(Express.urlencoded({ extended: false }));
app.use(Express.static("public"));
connection();
app.use(Express.json());
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
app.use("/users", authRoute);
//app.use("/users", userRoute);
app.use("/emergency", emergencyRoute);
app.all("*", (req, res) => {
  res.status(404).json({ message: "page not found ,, check your url" });
});
app.use(errorController);
const port = 3000;
app.listen(port, () => {
  console.log(`app is running at port ${port}`);
});
