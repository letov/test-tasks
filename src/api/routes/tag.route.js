import express from "express";
import { tagController } from "../controllers/tag.controller.js";
import { configCommon }  from "../../config.js";
import { authMiddleware } from "../controllers/auth.controller.js";

const tagRouter = express.Router();

tagRouter.use(authMiddleware);

/**
 * @openapi
 * components:
 *    schemas:
 *     TagSchema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         sortOrder:
 *           type: string
 */

/**
 * @openapi
 * /tag:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagSchema'
 *     responses:
 *       200:
 *        description: tag data
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
tagRouter.post('/tag', async function(req, res, next) {
    const uid = req.authInfo.uid;
    tagController.createTag(uid, req.body)
        .then(json => {
            res.json(json);
        })
        .catch(next);
});

/**
 * @openapi
 * /tag/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - tag
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *     responses:
 *       200:
 *        description: tag data
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
tagRouter.get('/tag/:id', async function(req, res, next) {
    const id = req.params.id;
    tagController.getTag(id)
        .then(json => {
            res.json(json);
        })
        .catch(next);
});

/**
 * @openapi
 * /tag:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - tag
 *     parameters:
 *      - in: query
 *        name: sortByOrder
 *        type: string
 *      - in: query
 *        name: sortByName
 *        type: string
 *      - in: query
 *        name: offset
 *        type: string
 *      - in: query
 *        name: length
 *        type: string
 *     responses:
 *       200:
 *        description: tag data
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorSchema'
 */
tagRouter.get('/tag', async function(req, res, next) {
    tagController.getTags(req.query)
        .then(json => {
            res.json(json);
        })
        .catch(next);
});

export { tagRouter };
