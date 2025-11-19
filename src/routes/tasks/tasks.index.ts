import { CreateRouter } from '../../lib/create-app.ts';
import * as handlers from './tasks.handlers.ts';
import * as routes from './tasks.routes.ts'

const router = CreateRouter()
    .openapi(routes.list, handlers.list)
    .openapi(routes.create, handlers.create)
    .openapi(routes.getOne, handlers.getOne)
    .openapi(routes.patch, handlers.patch)
    .openapi(routes.remove, handlers.remove);

export default router;