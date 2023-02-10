import { randomUUID } from "node:crypto";
import { CustomerDTO } from "@app/dtos/customer.dto";
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

  public static generateCustomerDTO(): CustomerDTO {
    return {
      id: randomUUID(),
      name: "Random Name",
      birthday: "10/02/1999",
      cpf: "888.958.000-36",
      createdAt: new Date(),
    };
  }
}
