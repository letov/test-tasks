import jwt from "jsonwebtoken";
import { configCommon }  from "../../config.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.split(' ')[1] ?? '';
    req.authInfo = jwt.verify(token, configCommon.secret);
    next();
}

export { authMiddleware }
