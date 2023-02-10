import { CustomerDTO } from "@app/dtos/customer.dto";
import { Customer } from "@domain/customer/customer.entity";

export class CustomerAppMapper {
  public static toDTO(customer: Customer): CustomerDTO {
    return {
      id: customer.id,
      name: customer.name.value,
      birthday: customer.birthday.stringValue,
      cpf: customer.cpf.getFormattedCPF(),
      createdAt: customer.createdAt,
    };
  }

  public static bulkToDTO(customers: Customer[]): CustomerDTO[] {
    return customers.map((entity) => CustomerAppMapper.toDTO(entity));
  }
}
