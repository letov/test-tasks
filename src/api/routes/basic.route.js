import express from "express";
import { userRouter } from "./user.route.js";
import { tagRouter } from "./tag.route.js";

const basicRouter = express.Router();

basicRouter.use('/', userRouter);
basicRouter.use('/', tagRouter);

export { basicRouter };
