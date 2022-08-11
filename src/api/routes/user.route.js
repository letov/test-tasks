import express from "express";
import { userController } from "../controllers/user.controller.js";
import { configCommon }  from "../../config.js";

const userRouter = express.Router();

/**
 * @openapi
 * components:
 *    schemas:
 *     UserSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         nickname:
 *           type: string
 *     LoginSchema:
 *      type: object
 *      properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     TokenSchema:
 *      type: object
 *      properties:
 *         token:
 *           type: string
 *         expires:
 *           type: string
 *     ErrorSchema:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 */

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSchema'
 *     responses:
 *       200:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenSchema'
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
userRouter.post('/signin', async function(req, res, next) {
    userController.singin(req.body)
        .then(token => {
                res.json({token, "expires": configCommon.expires});
        })
        .catch(next);
});

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginSchema'
 *     responses:
 *       200:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenSchema'
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
userRouter.post('/login', async function(req, res, next) {
    userController.login(req.body)
        .then(token => {
            res.json({token, "expires": configCommon.expires});
        })
        .catch(next);
});

export { userRouter };
