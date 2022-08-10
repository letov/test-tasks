import express from "express";
import { userController } from "../controllers/user.controller.js";
import { configCommon }  from "../../config.js";

const userRouter = express.Router();

userRouter.post('/signin', async function(req, res, next) {
    userController.singin(req.body)
        .then(token => {
                res.json({"token": token, "expires": configCommon.expires});
        })
        .catch(next);
});

userRouter.post('/login', async function(req, res, next) {
    userController.login(req.body)
        .then(token => {
            res.json({"token": token, "expires": configCommon.expires});
        })
        .catch(next);
});

export { userRouter };
