
import type { AppOpenAPI } from './types.js'; 
import packageJSON from '../../package.json' with {type: 'json'};
import {Scalar} from "@scalar/hono-api-reference";


export default function configureOpenAPI(app: AppOpenAPI) {

    app.doc("/doc", {
        openapi: "3.0.0",
        info: {
            title: "Tasks API",
            version: packageJSON.version,
        },
    });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  )
}