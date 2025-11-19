import createApp from "./lib/create-app.ts";
import index from "./routes/index.route.ts";
import configureOpenAPI from "./lib/configure-open-api.ts";
import tasks from "./routes/tasks/tasks.index.ts";

const app = createApp();

const routes = [
    index,
    tasks,
] as const;

configureOpenAPI(app);

routes.forEach((route) => {
    app.route("/", route);
});

export type AppType = typeof routes[number];
export default app