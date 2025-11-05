"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./all-exceptions.filter");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.enableCors({
        origin: ['http://localhost:3000'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT || 3005);
}
bootstrap();
//# sourceMappingURL=main.js.map