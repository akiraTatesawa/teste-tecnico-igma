import Joi from "joi";
import { CreateCustomerDTO } from "@app/dtos/create-customer.dto";

export namespace CustomerSchemas {
  export const createCustomerSchema = Joi.object<CreateCustomerDTO>({
    name: Joi.string().required().messages({
      "string.base": "'name' must be a string",
      "string.empty": "'name' cannot be an empty field",
      "any.required": "'name' is required",
    }),
    birthday: Joi.string().required().messages({
      "string.base": "'birthday' must be a string",
      "string.empty": "'birthday' cannot be an empty field",
      "any.required": "'birthday' is required",
    }),
    cpf: Joi.string().required().messages({
      "string.base": "'cpf' must be a string",
      "string.empty": "'cpf' cannot be an empty field",
      "any.required": "'cpf' is required",
    }),
  });
}
