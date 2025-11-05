"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const token_1 = require("../../utils/token");
const tokenBlacklist_1 = require("../../utils/tokenBlacklist");
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(createAuthDto, res) {
        const { username, email, password } = createAuthDto;
        const existingUser = await this.userModel.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            username,
            email,
            password: hashedPassword,
            refreshToken: '',
        });
        console.log('newUser', newUser);
        const { accessToken, refreshToken } = (0, token_1.generateTokens)({
            id: newUser?._id?.toString(),
            username: newUser?.username,
            email: newUser?.email,
        });
        newUser['refreshToken'] = refreshToken;
        await newUser.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            success: true,
            message: 'User registered successfully',
            accessToken,
        };
    }
    async login(createAuthDto, res, req) {
        const { email, password } = createAuthDto;
        const newUser = await this.userModel.findOne({ email });
        if (!newUser)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isPasswordValid = await bcrypt.compare(password, newUser.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const { accessToken, refreshToken } = (0, token_1.generateTokens)({
            id: newUser?._id?.toString(),
            username: newUser?.username,
            email: newUser?.email,
        });
        newUser['refreshToken'] = refreshToken;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            success: true,
            message: 'Login successful',
            accessToken,
        };
    }
    async refresh(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'No refresh token or invalid refresh token provided',
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret');
            const user = await this.userModel.findById(decoded.user?.id);
            const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)({
                id: user?._id?.toString(),
                username: user?.username,
                email: user?.email,
            });
            await this.userModel.findByIdAndUpdate(user?._id, {
                refreshToken: newRefreshToken,
            });
            req.res?.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return { success: true, accessToken };
        }
        catch (error) {
            console.error('Refresh token error:', error);
            throw new common_1.HttpException({ success: false, message: 'Invalid or expired refresh token' }, common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async logout(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) {
                return res
                    .status(common_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, message: 'No token provided' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded?.jti) {
                (0, tokenBlacklist_1.addToBlacklist)(decoded.jti);
            }
            else {
                throw new common_1.UnauthorizedException('Invalid token payload');
            }
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                message: 'Logout successful. Token has been blacklisted.',
            });
        }
        catch (error) {
            console.error('Logout error:', error.message);
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map