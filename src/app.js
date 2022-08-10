import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configCommon }  from "./config.js";
import { basicRouter } from "./api/routes/basic.route.js";

const app = express();

app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use('/', basicRouter);

const errorHandler = (error, request, response, next) => {
    const code = error.code || 400;
    response.status(code).send(error.message);
}
app.use(errorHandler);

app.listen(configCommon.expressPort);
