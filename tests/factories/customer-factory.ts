import { Customer, CreateCustomerProps } from "@domain/customer/customer.entity";

export class CustomerFactory {
  public static generateCustomer(props: Partial<CreateCustomerProps> = {}): Customer {
    const customerProps: CreateCustomerProps = {
      name: "Random Name",
      birthday: "10/02/1999",
      cpf: "888.958.000-36",
      ...props,
    };

    const customer = Customer.create(customerProps).result as Customer;

    return customer;
  }
}
