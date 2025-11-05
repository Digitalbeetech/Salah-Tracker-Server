interface GeneratedTokens {
    accessToken: string;
    refreshToken: string;
    jti: string;
}
export declare const generateTokens: (user: any) => GeneratedTokens;
export {};
