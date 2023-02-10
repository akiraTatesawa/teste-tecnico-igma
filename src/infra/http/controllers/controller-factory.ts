import { CreateCustomerImpl } from "@app/use-cases/create-customer.use-case";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCustomerRepository } from "@infra/data/repositories/prisma/prisma-customer-repository";
import { CustomerController } from "./customer-controller";

export class ControllerFactory {
  public static createCustomerController(): CustomerController {
    const customerRepository = new PrismaCustomerRepository(prisma);
    const createCustomerUseCase = new CreateCustomerImpl(customerRepository);

    return new CustomerController(createCustomerUseCase);
  }
}

export const customerController = ControllerFactory.createCustomerController();
