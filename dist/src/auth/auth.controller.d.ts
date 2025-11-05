import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createAuthDto: CreateAuthDto, res: Response): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
    }>;
    login(createAuthDto: CreateAuthDto, res: Response, req: Request): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
    }>;
    refresh(createAuthDto: CreateAuthDto, res: Response, req: Request): Promise<{
        success: boolean;
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<any>;
    getProfile(req: any): any;
}
