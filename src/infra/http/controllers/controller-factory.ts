import { CustomerRepository } from "@app/ports/repositories/customer-repository";
import { CreateCustomerImpl } from "@app/use-cases/create-customer.use-case";
import { InMemoryTestCustomerRepository } from "@tests/repositories/in-memory-customer-repository";
import { CustomerController } from "./customer-controller";

export class ControllerFactory {
  public static createCustomerController(): CustomerController {
    const customerRepository: CustomerRepository = new InMemoryTestCustomerRepository();
    const createCustomerUseCase = new CreateCustomerImpl(customerRepository);

    return new CustomerController(createCustomerUseCase);
  }
}

export const customerController = ControllerFactory.createCustomerController();
