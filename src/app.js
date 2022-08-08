import express from "express";
import cors from "cors";
import { configCommon } from "./config.js";

const app = express();

app.use(cors({origin: '*'}));

app.get('/', (req, res) => {
    res.send("sss")
})

app.listen(configCommon.expressPort);