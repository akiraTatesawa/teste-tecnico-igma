import { CustomerRepository } from "@app/ports/repositories/customer-repository";
import { Customer } from "@domain/customer/customer.entity";
import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { CustomerDataMapper } from "@infra/data/mappers/customer-data-mapper";

export class PrismaCustomerRepository implements CustomerRepository {
  private readonly _prisma: PrismaDatabase;

  constructor(prisma: PrismaDatabase) {
    this._prisma = prisma;
  }

  public async findByCPF(cpf: string): Promise<Customer | null> {
    const rawCustomer = await this._prisma.customer.findUnique({
      where: {
        cpf,
      },
    });

    if (!rawCustomer) return null;

    return CustomerDataMapper.toDomain(rawCustomer);
  }

  public async insert(customer: Customer): Promise<void> {
    const rawCustomer = CustomerDataMapper.toPersistence(customer);

    await this._prisma.customer.create({
      data: rawCustomer,
    });
  }
}
