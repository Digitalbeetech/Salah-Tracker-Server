import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
export declare class DatabaseService implements OnModuleInit {
    private readonly connection;
    private readonly logger;
    constructor(connection: Connection);
    onModuleInit(): Promise<void>;
    getConnection(): Connection;
}
