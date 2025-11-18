import { OpenAPIHono } from '@hono/zod-openapi'

import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import pinoLogger from '../middlewares/pino-logger';
import type { AppBindings, AppOpenAPI } from './types';
import { defaultHook } from 'stoker/openapi';

export function CreateRouter() {
    return new OpenAPIHono<AppBindings>({
        strict: false,
        defaultHook,
    });

}

export default function CreateApp() {
    const app = new OpenAPIHono<AppBindings>({
        strict: false,
    });
    app.use(serveEmojiFavicon('🚀'));
    app.use(pinoLogger());


    app.notFound(notFound);
    app.onError(onError);
    return app;
}

export function CreateTestApp(router: AppOpenAPI) {
    const testApp = CreateApp();
    testApp.route('/', router);
    return testApp;
}