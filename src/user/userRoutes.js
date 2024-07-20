import Express from "express";
import validation from "../middleware/joiValidation.js";
import * as userController from "./userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { udatePasswordSchema, updateSchema } from "./userVlidation.js";

const router = Express.Router();
router.use(protect);
router
  .route("/")
  .patch(
    validation(updateSchema),
    userController.updateMe
  )
  .delete(userController.deleteMe)
  .get(userController.getMe);
router.patch(
  "/updatePasssword",
  validation(udatePasswordSchema),
  userController.updateMyPassword
);
router.patch("/:softDelete", userController.softDelete);
export default router;
