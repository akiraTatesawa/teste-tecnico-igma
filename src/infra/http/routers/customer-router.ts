import { ExpressRouter } from "@core/infra/http/express-router";
import { SchemaValidator } from "../middlewares/schema-validator.middleware";
import { CustomerSchemas } from "../schemas/customer-schemas";
import { customerController } from "../controllers/controller-factory";

export class CustomerRouter extends ExpressRouter {
  protected configRouter(): void {
    // Create Customer
    this.expressRouter.post(
      "/",
      SchemaValidator.validateBody(CustomerSchemas.createCustomerSchema),
      customerController.createCustomer
    );

    // List Customer by CPF
    this.expressRouter.get("/:customerCPF", customerController.listCustomerByCPF);

    // List Many Customers
    this.expressRouter.get("/", customerController.listManyCustomers);
  }
}
