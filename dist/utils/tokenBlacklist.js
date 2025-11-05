"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlacklisted = exports.addToBlacklist = void 0;
const blacklistedTokens = new Set();
const addToBlacklist = (jti) => {
    blacklistedTokens.add(jti);
    console.log(`🚫 Token blacklisted: ${jti}`);
};
exports.addToBlacklist = addToBlacklist;
const isBlacklisted = (jti) => {
    return blacklistedTokens.has(jti);
};
exports.isBlacklisted = isBlacklisted;
//# sourceMappingURL=tokenBlacklist.js.map