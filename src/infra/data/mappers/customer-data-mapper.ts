import { PrismaCustomer } from "@prisma/client";
import { Customer } from "@domain/customer/customer.entity";
import { CustomerBirthday } from "@domain/customer/customer-birthday.vo";

export class CustomerDataMapper {
  public static toDomain(raw: PrismaCustomer): Customer {
    const birthdayOrError = CustomerBirthday.createFromDate(raw.birthday);
    const birthday = birthdayOrError.result as CustomerBirthday;

    const customerEntityOrError = Customer.create({
      id: raw.id,
      name: raw.name,
      birthday: birthday.stringValue,
      cpf: raw.cpf,
      createdAt: raw.createdAt,
    });

    return customerEntityOrError.result as Customer;
  }

  public static toPersistence(customer: Customer): PrismaCustomer {
    return {
      id: customer.id,
      name: customer.name.value,
      birthday: customer.birthday.dateValue,
      cpf: customer.cpf.value,
      createdAt: customer.createdAt,
    };
  }
}
