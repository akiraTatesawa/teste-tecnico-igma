import { Customer } from "@domain/customer/customer.entity";
import { prisma } from "@infra/data/databases/prisma/config/prisma.database";
import { PrismaCustomerRepository } from "@infra/data/repositories/prisma/prisma-customer-repository";
import { CustomerFactory } from "@tests/factories/customer-factory";

export class CustomerTestHelper {
  public static async createCustomer(cpf: string): Promise<Customer> {
    const customerRepo = new PrismaCustomerRepository(prisma);

    const fakeCustomer = CustomerFactory.generateCustomer({ cpf });

    await customerRepo.insert(fakeCustomer);

    return fakeCustomer;
  }
}
