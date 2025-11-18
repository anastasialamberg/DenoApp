
import { CreateRouter } from "../lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpstatusCodes from "stoker/http-status-codes";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
const router = CreateRouter()
    .openapi(createRoute({
        tags: ["Index"],
        method: 'get',
        path: '/',
        responses: {
            [HttpstatusCodes.OK]: jsonContent(
                createMessageObjectSchema("Tasks API"),
                "Tasks API Index",
            ),
        },
    }),
        (c) => {
            return c.json({
                message: "Tasks API",
            }, HttpstatusCodes.OK);
        }
    );
export default router;
