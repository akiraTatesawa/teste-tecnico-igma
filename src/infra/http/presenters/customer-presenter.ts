import dayjs from "dayjs";
import { CustomerDTO } from "@app/dtos/customer.dto";
import { CustomerViewModel } from "../view-models/customer.view-model";

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
}
