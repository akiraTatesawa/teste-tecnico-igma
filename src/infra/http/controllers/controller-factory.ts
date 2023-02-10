import { CreateCustomerImpl } from "@app/use-cases/create-customer.use-case";
import { ListCustomerByCPFImpl } from "@app/use-cases/list-customer-by-cpf.use-case";
import { ListManyCustomersImpl } from "@app/use-cases/list-many-customers.use-case";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCustomerRepository } from "@infra/data/repositories/prisma/prisma-customer-repository";
import { CustomerController } from "./customer-controller";

export class ControllerFactory {
  public static createCustomerController(): CustomerController {
    const customerRepository = new PrismaCustomerRepository(prisma);

    const createCustomerUseCase = new CreateCustomerImpl(customerRepository);
    const listCustomerByCPFUseCase = new ListCustomerByCPFImpl(customerRepository);
    const listManyCustomersUseCase = new ListManyCustomersImpl(customerRepository);

    return new CustomerController(
      createCustomerUseCase,
      listCustomerByCPFUseCase,
      listManyCustomersUseCase
    );
  }
}

export const customerController = ControllerFactory.createCustomerController();
