import { OpenAPIHono } from "@hono/zod-openapi";
import type { Schema } from "hono";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import pinoLogger from "../middlewares/pino-logger.ts";
import type { AppBindings, AppOpenAPI } from "./types.ts";
import { defaultHook } from "stoker/openapi";

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
  app.use(serveEmojiFavicon("🚀"));
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function CreateTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return CreateApp().route("/", router);
}
