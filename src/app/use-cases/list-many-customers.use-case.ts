import { CustomerDTO } from "@app/dtos/customer.dto";
import { ListManyCustomersFilters } from "@app/dtos/pagination.dto";
import { CustomerErrors } from "@app/errors/customer-errors";
import { CustomerAppMapper } from "@app/mappers/customer-app-mapper";
import { CustomerRepository } from "@app/ports/repositories/customer-repository";
import { UseCase } from "@core/app/use-cases";
import { Either, left, right } from "@core/logic/either";

type ListManyCustomersResponse = Either<CustomerErrors.InvalidParamsError, CustomerDTO[]>;

export interface ListManyCustomers
  extends UseCase<ListManyCustomersFilters, ListManyCustomersResponse> {}

export class ListManyCustomersImpl implements ListManyCustomers {
  private readonly _customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this._customerRepository = customerRepository;
  }

  private validateParams(
    param: string | undefined
  ): Either<CustomerErrors.InvalidParamsError, number | undefined> {
    if (param === undefined) {
      return right(undefined);
    }

    const paramToNumber = parseInt(param, 10);

    if (Number.isNaN(paramToNumber) || paramToNumber < 0) {
      return left(
        new CustomerErrors.InvalidParamsError("Limit and Offset must be non-negative numbers")
      );
    }

    return right(paramToNumber);
  }

  public async execute(request: ListManyCustomersFilters): Promise<ListManyCustomersResponse> {
    const { limit, offset } = request;

    const limitOrError = this.validateParams(limit);
    const offsetOrError = this.validateParams(offset);

    if (limitOrError.isLeft()) {
      return left(limitOrError.result);
    }
    if (offsetOrError.isLeft()) {
      return left(offsetOrError.result);
    }

    const validatedLimit = limitOrError.result;
    const validatedOffset = offsetOrError.result;

    const customers = await this._customerRepository.listAll({
      skip: validatedOffset ?? 0,
      take: validatedLimit,
    });

    return right(CustomerAppMapper.bulkToDTO(customers));
  }
}
