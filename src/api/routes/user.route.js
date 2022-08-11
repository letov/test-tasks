import express from "express";
import { userController } from "../controllers/user.controller.js";
import { configCommon }  from "../../config.js";
import { authMiddleware } from "../controllers/auth.controller.js";

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
            res.json({ token, "expires": configCommon.expires } );
        })
        .catch(next);
});

userRouter.use(authMiddleware);

/**
 * @openapi
 * /user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - user
 *     responses:
 *       200:
 *        description: user data
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
userRouter.post('/user', async function(req, res, next) {
    const uid = req.authInfo.uid;
    userController.getUser(uid)
        .then(user => {
            res.json(user);
        })
        .catch(next);
});

/**
 * @openapi
 * /user:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - user
 *     requestBody:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSchema'
 *     responses:
 *       200:
 *        description: user data
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
userRouter.put('/user', async function(req, res, next) {
    const uid = req.authInfo.uid;
    userController.updateUser(uid, req.body)
        .then(user => {
            res.json(user);
        })
        .catch(next);
});

/**
 * @openapi
 * /user:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - user
 *     responses:
 *       200:
 *        description: user data
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
userRouter.delete('/user', async function(req, res, next) {
    const uid = req.authInfo.uid;
    userController.deleteUser(uid)
        .then(user => {
            res.json({ "message": "you killed ))" });
        })
        .catch(next);
});

export { userRouter };
