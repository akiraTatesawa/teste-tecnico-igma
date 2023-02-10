import dayjs from "dayjs";
import { CustomerDTO } from "@app/dtos/customer.dto";
import { CustomerViewModel, ManyCustomersViewModel } from "../view-models/customer.view-model";

export class CustomerPresenter {
  public static toViewModel(customerDTO: CustomerDTO): CustomerViewModel {
    return {
      customer: {
        id: customerDTO.id,
        name: customerDTO.name,
        cpf: customerDTO.cpf,
        birthday: customerDTO.birthday,
        registrationDate: dayjs(customerDTO.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      },
    };
  }

  public static bulkToViewModel(customersDTO: CustomerDTO[]): ManyCustomersViewModel {
    const customers = customersDTO.map((customerDTO) => ({
      id: customerDTO.id,
      name: customerDTO.name,
      cpf: customerDTO.cpf,
      birthday: customerDTO.birthday,
      registrationDate: dayjs(customerDTO.createdAt).format("DD/MM/YYYY HH:mm:ss"),
    }));

    return {
      customers,
    };
  }
}
