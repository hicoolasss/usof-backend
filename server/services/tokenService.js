import jwt from 'jsonwebtoken';
import tokenModel from '../models/Token.js';

const JWT_ACCESS_SECRET = "pidorpizda"
const JWT_REFRESH_SECRET = "pidorpizda"

class TokenService {
    
    staticgenerateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        console.log("saving token:", refreshToken);
        const tokenData = await tokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            console.log("token found, updating", tokenData);
            return tokenData.save();
        }
        console.log("token not found, creating new one");
        const token = await tokenModel.create({ user: userId, refreshToken })
        console.log("token saved:", token);
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData;
    }

    async findToken(refreshToken) {
        try {
            const tokenData = await tokenModel.findOne({ refreshToken });
            console.log("tokenData:", tokenData);
            return tokenData;
        } catch (error) {
            console.error("Error finding token:", error);
            throw error;
        }
    }

}

export default new TokenService();