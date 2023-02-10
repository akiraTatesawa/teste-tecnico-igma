import { CustomerDTO } from "@app/dtos/customer.dto";
import { CustomerErrors } from "@app/errors/customer-errors";
import { EntityErrors } from "@app/errors/entity-errors";
import { UseCase } from "@core/app/use-cases";
import { Either, left, right } from "@core/logic/either";
import { CreateCustomerDTO } from "@app/dtos/create-customer.dto";
import { CustomerRepository } from "@app/ports/repositories/customer-repository";
import { Customer } from "@domain/customer/customer.entity";

type CreateCustomerResponse = Either<
  EntityErrors.EntityCreationError | CustomerErrors.CPFNotUniqueError,
  CustomerDTO
>;

export interface CreateCustomerUseCase extends UseCase<CreateCustomerDTO, CreateCustomerResponse> {}

export class CreateCustomerImpl implements CreateCustomerUseCase {
  private readonly _customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this._customerRepository = customerRepository;
  }

  public async execute(request: CreateCustomerDTO): Promise<CreateCustomerResponse> {
    const { name, birthday, cpf } = request;

    const customerEntityOrError = Customer.create({
      name,
      birthday,
      cpf,
    });

    if (customerEntityOrError.isLeft()) {
      const customerError = customerEntityOrError.result;

      return left(new EntityErrors.EntityCreationError(customerError.message));
    }

    const customerEntity = customerEntityOrError.result;

    const dbCustomer = await this._customerRepository.findByCPF(customerEntity.cpf.value);
    if (dbCustomer) {
      return left(new CustomerErrors.CPFNotUniqueError(dbCustomer.cpf.getFormattedCPF()));
    }

    await this._customerRepository.insert(customerEntity);

    return right({
      id: customerEntity.id,
      name: customerEntity.name.value,
      birthday: customerEntity.birthday.stringValue,
      cpf: customerEntity.cpf.getFormattedCPF(),
      createdAt: customerEntity.createdAt,
    });
  }
}
