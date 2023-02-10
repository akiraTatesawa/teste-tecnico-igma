import { CustomerDTO } from "@app/dtos/customer.dto";
import { ListCustomerByCPFDto } from "@app/dtos/list-customer.dto";
import { CustomerErrors } from "@app/errors/customer-errors";
import { EntityErrors } from "@app/errors/entity-errors";
import { CustomerRepository } from "@app/ports/repositories/customer-repository";
import { UseCase } from "@core/app/use-cases";
import { Either, left, right } from "@core/logic/either";
import { CustomerCPF } from "@domain/customer/customer-cpf.vo";

type ListCustomerByCPFResponse = Either<
  EntityErrors.EntityCreationError | CustomerErrors.NotFoundError,
  CustomerDTO
>;

export interface ListCustomerByCPF
  extends UseCase<ListCustomerByCPFDto, ListCustomerByCPFResponse> {}

export class ListCustomerByCPFImpl implements ListCustomerByCPF {
  private readonly _customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this._customerRepository = customerRepository;
  }

  public async execute({ cpf }: ListCustomerByCPFDto): Promise<ListCustomerByCPFResponse> {
    const cpfOrError = CustomerCPF.create(cpf);

    if (cpfOrError.isLeft()) {
      return left(new EntityErrors.EntityCreationError(cpfOrError.result.message));
    }

    const cpfValueObject: CustomerCPF = cpfOrError.result;

    const customer = await this._customerRepository.findByCPF(cpfValueObject.value);

    if (!customer) {
      return left(new CustomerErrors.NotFoundError());
    }

    return right({
      id: customer.id,
      name: customer.name.value,
      birthday: customer.birthday.stringValue,
      cpf: customer.cpf.getFormattedCPF(),
      createdAt: customer.createdAt,
    });
  }
}
