import jwt from 'jsonwebtoken'; // если вы используете JWT
import tokenService from '../services/tokenService.js';

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: "Token error" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: "Token bad formatted" });
    }

    try {
        const decoded = jwt.verify(token, 'pidorpizda');
        
        // // Проверяем наличие refreshToken для этого пользователя в базе данных
        const refreshToken = await tokenService.findToken(token);
        console.log("refreshToken:", refreshToken);
        
        if (!refreshToken) {
            return res.status(401).json({ error: "Token is no longer valid" });
        }

        // Если все хорошо, добавляем информацию о пользователе в req.user
        req.user = decoded;

        return next();

    } catch (err) {
        return res.status(401).json({ error: "Token invalid" });
    }
};

export default authenticationMiddleware;