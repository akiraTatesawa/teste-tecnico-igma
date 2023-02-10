import { ExpressRouter } from "@core/infra/http/express-router";
import { CustomerRouter } from "./customer-router";

export class ServerRouter extends ExpressRouter {
  protected configRouter(): void {
    // Customers Endpoint
    this.expressRouter.use("/customers", new CustomerRouter().expressRouter);
  }
}
