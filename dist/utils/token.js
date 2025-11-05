"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jwt = require("jsonwebtoken");
const uuid_1 = require("uuid");
const generateTokens = (user) => {
    const jti = (0, uuid_1.v4)();
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '15m',
        jwtid: jti,
    });
    const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', { expiresIn: '7d' });
    return { accessToken, refreshToken, jti };
};
exports.generateTokens = generateTokens;
//# sourceMappingURL=token.js.map