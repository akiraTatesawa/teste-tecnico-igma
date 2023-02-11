import swaggerUi from "swagger-ui-express";
import swaggerDocument from "@root/swagger.json";

import { ExpressRouter } from "@core/infra/http/express-router";
import { CustomerRouter } from "./customer-router";

export class ServerRouter extends ExpressRouter {
  protected configRouter(): void {
    // Swagger API Docs
    this.expressRouter.use("/api-docs", swaggerUi.serve);
    this.expressRouter.get("/api-docs", swaggerUi.setup(swaggerDocument));

    // Customers Endpoint
    this.expressRouter.use("/customers", new CustomerRouter().expressRouter);
  }
}
