import { Response } from "express";
import { CustomerErrors } from "@app/errors/customer-errors";
import { EntityErrors } from "@app/errors/entity-errors";
import { CreateCustomerUseCase } from "@app/use-cases/create-customer.use-case";
import { BaseController } from "@core/infra/http/base-controller";
import { CustomerDTO } from "@app/dtos/customer.dto";
import { CreateCustomerRequest } from "../requests/create-customer.request";
import { CustomerViewModel } from "../view-models/customer.view-model";
import { CustomerPresenter } from "../presenters/customer-presenter";

export class CustomerController extends BaseController {
  private readonly _createCustomerUseCase: CreateCustomerUseCase;

  constructor(createCustomerUseCase: CreateCustomerUseCase) {
    super();
    this._createCustomerUseCase = createCustomerUseCase;

    this.createCustomer = this.createCustomer.bind(this);
  }

  public async createCustomer(req: CreateCustomerRequest, res: Response): Promise<Response> {
    const { name, birthday, cpf } = req.body;

    const createCustomerOrError = await this._createCustomerUseCase.execute({
      name,
      cpf,
      birthday,
    });

    if (createCustomerOrError.isLeft()) {
      const createCustomerError = createCustomerOrError.result;
      const errorMessage = createCustomerError.message;

      switch (createCustomerError.constructor) {
        case EntityErrors.EntityCreationError:
          return this.unprocessableEntity(res, errorMessage);

        case CustomerErrors.CPFNotUniqueError:
          return this.conflict(res, errorMessage);

        default:
          return this.fail(res, errorMessage);
      }
    }

    const customerDTO: CustomerDTO = createCustomerOrError.result;
    const customerViewModel: CustomerViewModel = CustomerPresenter.toViewModel(customerDTO);

    return this.created<CustomerViewModel>(res, customerViewModel);
  }
}
