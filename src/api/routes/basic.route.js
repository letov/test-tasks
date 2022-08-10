import express from "express";
import { userRouter } from "./user.route.js";

const basicRouter = express.Router();

basicRouter.use('/', userRouter);

export { basicRouter };
