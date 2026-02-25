"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_ws_1 = require("@nestjs/platform-ws");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(() => { });
//# sourceMappingURL=main.js.map