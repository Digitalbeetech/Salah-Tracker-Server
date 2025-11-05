import { CreateAuthDto } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<User>);
    register(createAuthDto: CreateAuthDto, res: any): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
    }>;
    login(createAuthDto: CreateAuthDto, res: any, req: any): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
    }>;
    refresh(req: any, res: any): Promise<{
        success: boolean;
        accessToken: string;
    }>;
    logout(req: any, res: any): Promise<any>;
}
