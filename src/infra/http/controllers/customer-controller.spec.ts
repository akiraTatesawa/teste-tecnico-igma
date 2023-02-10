import * as express from "express";
import { CreateCustomerUseCase } from "@app/use-cases/create-customer.use-case";
import { left, right } from "@core/logic/either";
import { CustomerFactory } from "@tests/factories/customer-factory";
import { CustomerErrors } from "@app/errors/customer-errors";
import { EntityErrors } from "@app/errors/entity-errors";
import httpStatus from "http-status";
import { CustomerController } from "./customer-controller";
import { CreateCustomerRequest } from "../requests/create-customer.request";

describe("Customer Controller", () => {
  let mockCreateCustomer: CreateCustomerUseCase;

  let sut: CustomerController;

  const createMockResponse = () => {
    const res = {} as express.Response;
    res.status = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    mockCreateCustomer = { execute: jest.fn() };
    sut = new CustomerController(mockCreateCustomer);
  });

  describe("Create Customer", () => {
    it("Should return the Customer View Model", async () => {
      const mockCustomerDTO = CustomerFactory.generateCustomerDTO();
      const mockResponse = createMockResponse();
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
      const mockResponse = createMockResponse();
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
      const mockResponse = createMockResponse();
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
      const mockResponse = createMockResponse();
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
});
