import { CustomerRepository } from "@app/ports/repositories/customer-repository";
import { Customer } from "@domain/customer/customer.entity";

export class InMemoryTestCustomerRepository implements CustomerRepository {
  public customers: Customer[] = [];

  public async insert(entity: Customer): Promise<void> {
    this.customers.push(entity);
  }

  public async findByCPF(cpf: string): Promise<Customer | null> {
    const customer = this.customers.find((dbCustomer) => dbCustomer.cpf.value === cpf);

    if (!customer) return null;

    return customer;
  }
}
