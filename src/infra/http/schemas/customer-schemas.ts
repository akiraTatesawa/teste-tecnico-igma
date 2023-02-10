import Joi from "joi";
import { CreateCustomerDTO } from "@app/dtos/create-customer.dto";

export namespace CustomerSchemas {
  export const createCustomerSchema = Joi.object<CreateCustomerDTO>({
    name: Joi.string().required(),
    birthday: Joi.string().required(),
    cpf: Joi.string().required(),
  });
}
