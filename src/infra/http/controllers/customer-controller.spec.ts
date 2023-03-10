import httpStatus from "http-status";
import { CreateCustomerUseCase } from "@app/use-cases/create-customer.use-case";
import { left, right } from "@core/logic/either";
import { CustomerFactory } from "@tests/factories/customer-factory";
import { CustomerErrors } from "@app/errors/customer-errors";
import { EntityErrors } from "@app/errors/entity-errors";
import { ListCustomerByCPF } from "@app/use-cases/list-customer-by-cpf.use-case";
import { ExpressFactory } from "@tests/factories/express-factory";
import { ListManyCustomers } from "@app/use-cases/list-many-customers.use-case";
import { CustomerController } from "./customer-controller";
import { CreateCustomerRequest } from "../requests/create-customer.request";
import { ListCustomerRequest, ListManyCustomersRequest } from "../requests/list-customer.request";
import { CustomerPresenter } from "../presenters/customer-presenter";

describe("Customer Controller", () => {
  let mockCreateCustomer: CreateCustomerUseCase;
  let mockListCustomer: ListCustomerByCPF;
  let mockListManyCustomers: ListManyCustomers;

  let sut: CustomerController;

  beforeEach(() => {
    mockCreateCustomer = { execute: jest.fn() };
    mockListCustomer = { execute: jest.fn() };
    mockListManyCustomers = { execute: jest.fn() };

    sut = new CustomerController(mockCreateCustomer, mockListCustomer, mockListManyCustomers);
  });

  describe("Create Customer", () => {
    it("Should return the Customer View Model", async () => {
      const mockCustomerDTO = CustomerFactory.generateCustomerDTO();
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        body: {
          name: mockCustomerDTO.name,
          birthday: mockCustomerDTO.birthday,
          cpf: mockCustomerDTO.cpf,
        },
      } as CreateCustomerRequest;
      jest.spyOn(mockCreateCustomer, "execute").mockResolvedValueOnce(right(mockCustomerDTO));

      await sut.createCustomer(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it("Should return a Conflict Error if the CPF is already registered", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        body: {
          name: "Fake Name",
          birthday: "01/09/1999",
          cpf: "690.141.340-88",
        },
      } as CreateCustomerRequest;
      jest
        .spyOn(mockCreateCustomer, "execute")
        .mockResolvedValueOnce(left(new CustomerErrors.CPFNotUniqueError(request.body.cpf)));

      await sut.createCustomer(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "Conflict",
        message: `The CPF '${request.body.cpf}' is already being used`,
      });
    });

    it("Should return a Unprocessable Entity Error if the cpf, name or birthday is invalid", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        body: {
          name: "Fake Name",
          birthday: "01/09/1999",
          cpf: "690.141.340-90",
        },
      } as CreateCustomerRequest;
      jest
        .spyOn(mockCreateCustomer, "execute")
        .mockResolvedValueOnce(left(new EntityErrors.EntityCreationError("Invalid CPF")));

      await sut.createCustomer(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "Unprocessable Entity",
        message: "Invalid CPF",
      });
    });

    it("Should return an Internal Server Error if an unknown error occurs", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        body: {
          name: "Fake Name",
          birthday: "01/09/1999",
          cpf: "690.141.340-90",
        },
      } as CreateCustomerRequest;
      jest
        .spyOn(mockCreateCustomer, "execute")
        .mockResolvedValueOnce(left(new Error("Unknown Error")));

      await sut.createCustomer(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "Internal Server Error",
        message: "Unknown Error",
      });
    });
  });

  describe("List Customer", () => {
    it("Should return the Customer View Model", async () => {
      const mockCustomerDTO = CustomerFactory.generateCustomerDTO();
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        params: {
          customerCPF: mockCustomerDTO.cpf,
        },
      } as ListCustomerRequest;
      jest.spyOn(mockListCustomer, "execute").mockResolvedValueOnce(right(mockCustomerDTO));

      await sut.listCustomerByCPF(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it("Should return a Unprocessable Entity Error if the CPF is invalid", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        params: {
          customerCPF: "690.141.340-90",
        },
      } as ListCustomerRequest;
      jest
        .spyOn(mockListCustomer, "execute")
        .mockResolvedValueOnce(left(new EntityErrors.EntityCreationError("Invalid CPF")));

      await sut.listCustomerByCPF(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "Unprocessable Entity",
        message: "Invalid CPF",
      });
    });

    it("Should return an Internal Server Error if an unknown error occurs", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        params: {
          customerCPF: "",
        },
      } as ListCustomerRequest;
      jest
        .spyOn(mockListCustomer, "execute")
        .mockResolvedValueOnce(left(new Error("Unknown Error")));

      await sut.listCustomerByCPF(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "Internal Server Error",
        message: "Unknown Error",
      });
    });

    it("Should return a Not Found Error if the customer does not exist", async () => {
      const mockCustomerDTO = CustomerFactory.generateCustomerDTO();
      const mockResponse = ExpressFactory.createMockResponse();
      const request = {
        params: {
          customerCPF: mockCustomerDTO.cpf,
        },
      } as ListCustomerRequest;
      jest
        .spyOn(mockListCustomer, "execute")
        .mockResolvedValueOnce(left(new CustomerErrors.NotFoundError()));

      await sut.listCustomerByCPF(request, mockResponse);
    });
  });

  describe("List Many Customer", () => {
    it("Should return all the customers", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = { query: {} } as ListManyCustomersRequest;
      const customers = CustomerFactory.generateCustomerDTOArray();
      jest.spyOn(mockListManyCustomers, "execute").mockResolvedValueOnce(right(customers));

      await sut.listManyCustomers(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(CustomerPresenter.bulkToViewModel(customers));
    });

    it("Should return an Bad Request Error if limit or offset are invalid values", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = { query: { limit: "invalid" } } as ListManyCustomersRequest;
      jest
        .spyOn(mockListManyCustomers, "execute")
        .mockResolvedValueOnce(
          left(
            new CustomerErrors.InvalidParamsError("Limit and Offset must be non-negative numbers")
          )
        );

      await sut.listManyCustomers(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "Bad Request",
        message: "Limit and Offset must be non-negative numbers",
      });
    });

    it("Should return an Internal Server Error if an unknown error occurs", async () => {
      const mockResponse = ExpressFactory.createMockResponse();
      const request = { query: {} } as ListManyCustomersRequest;
      jest
        .spyOn(mockListManyCustomers, "execute")
        .mockResolvedValueOnce(left(new Error("Unknown Error")));

      await sut.listManyCustomers(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "Internal Server Error",
        message: "Unknown Error",
      });
    });
  });
});
