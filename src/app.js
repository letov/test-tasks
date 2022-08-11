import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configCommon }  from "./config.js";
import { basicRouter } from "./api/routes/basic.route.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API for test-tasks',
            version: '1.0.0',
        },
    },
    apis: ['./src/api/routes/*.route.js'],
    servers: [
        {
            url: `${configCommon.host}:${configCommon.port}`,
        },
    ],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use('/', basicRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const errorHandler = (error, request, response, next) => {
    const code = error.code || 400;
    response.status(code).json( { "error": error.message } );
}
app.use(errorHandler);

app.listen(configCommon.port);
