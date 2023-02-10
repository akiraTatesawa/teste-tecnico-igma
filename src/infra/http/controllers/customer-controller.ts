import { Response } from "express";
import { CustomerErrors } from "@app/errors/customer-errors";
import { EntityErrors } from "@app/errors/entity-errors";
import { CreateCustomerUseCase } from "@app/use-cases/create-customer.use-case";
import { BaseController } from "@core/infra/http/base-controller";
import { CustomerDTO } from "@app/dtos/customer.dto";
import { ListCustomerByCPF } from "@app/use-cases/list-customer-by-cpf.use-case";
import { CreateCustomerRequest } from "../requests/create-customer.request";
import { CustomerViewModel } from "../view-models/customer.view-model";
import { CustomerPresenter } from "../presenters/customer-presenter";
import { ListCustomerRequest } from "../requests/list-customer.request";

export class CustomerController extends BaseController {
  private readonly _createCustomerUseCase: CreateCustomerUseCase;

  private readonly _listCustomerByCPFUseCase: ListCustomerByCPF;

  constructor(
    createCustomerUseCase: CreateCustomerUseCase,
    listCustomerByCPFUseCase: ListCustomerByCPF
  ) {
    super();
    this._createCustomerUseCase = createCustomerUseCase;
    this._listCustomerByCPFUseCase = listCustomerByCPFUseCase;

    this.createCustomer = this.createCustomer.bind(this);
    this.listCustomerByCPF = this.listCustomerByCPF.bind(this);
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

  public async listCustomerByCPF(req: ListCustomerRequest, res: Response): Promise<Response> {
    const { customerCPF } = req.params;

    const listCustomerOrError = await this._listCustomerByCPFUseCase.execute({
      cpf: customerCPF,
    });

    if (listCustomerOrError.isLeft()) {
      const listCustomerError = listCustomerOrError.result;
      const errorMessage = listCustomerError.message;

      switch (listCustomerError.constructor) {
        case EntityErrors.EntityCreationError:
          return this.unprocessableEntity(res, errorMessage);

        case CustomerErrors.NotFoundError:
          return this.notFound(res, errorMessage);

        default:
          return this.fail(res, errorMessage);
      }
    }

    const customerDTO: CustomerDTO = listCustomerOrError.result;

    return this.ok<CustomerViewModel>(res, CustomerPresenter.toViewModel(customerDTO));
  }
}
