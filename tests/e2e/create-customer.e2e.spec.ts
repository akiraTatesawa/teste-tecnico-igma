// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";

import { ExpressApp } from "@infra/http/app";
import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { CreateCustomerDTO } from "@app/dtos/create-customer.dto";
import { CustomerTestHelper } from "./helpers/customer-helper";

describe("POST /customers", () => {
  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await new PrismaDatabase().cleanDb();
  });

  describe("Success", () => {
    it("[201::CREATED] Should be able to create a customer", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
        cpf: "127.773.620-09",
      };

      const response = await server.post("/customers").send(request);

      expect(response.statusCode).toEqual(httpStatus.CREATED);
      expect(response.body).toHaveProperty("customer", expect.any(Object));
      expect(response.body).toHaveProperty("customer.id", expect.any(String));
      expect(response.body).toHaveProperty("customer.name", request.name);
      expect(response.body).toHaveProperty("customer.cpf", request.cpf);
      expect(response.body).toHaveProperty("customer.birthday", request.birthday);
      expect(response.body).toHaveProperty("customer.registrationDate", expect.any(String));
    });
  });

  describe("Failure", () => {
    it("[400::BAD_REQUEST] Should return an error if there are missing fields on the request body", async () => {
      const request = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
      };

      const response = await server.post("/customers").send(request);

      expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty("name", "Bad Request");
      expect(response.body).toHaveProperty("message", "'cpf' is required");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the Name is invalid", async () => {
      const request: CreateCustomerDTO = {
        name: "Invalid Name 123",
        birthday: "01/09/1999",
        cpf: "127.773.620-09",
      };

      const response = await server.post("/customers").send(request);

      expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty("name", "Unprocessable Entity");
      expect(response.body).toHaveProperty("message", "Customer Name must consist of only letters");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the CPF has an invalid format", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
        cpf: "12731213123123132",
      };

      const response = await server.post("/customers").send(request);

      expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty("name", "Unprocessable Entity");
      expect(response.body).toHaveProperty(
        "message",
        "The CPF must follow the patterns '99999999900' or '999.999.999-00'"
      );
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the CPF digits are invalid", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
        cpf: "111.444.777-31",
      };

      const response = await server.post("/customers").send(request);

      expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty("name", "Unprocessable Entity");
      expect(response.body).toHaveProperty("message", "Invalid CPF");
    });

    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the Birthday has an invalid format", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01091999",
        cpf: "127.773.620-09",
      };

      const response = await server.post("/customers").send(request);

      expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty("name", "Unprocessable Entity");
      expect(response.body).toHaveProperty(
        "message",
        "The Birthday must follow the pattern 'DD/MM/YYYY'"
      );
    });

    it("[409::CONFLICT] Should return an error if the CPF is already registered", async () => {
      const fakeCustomer = await CustomerTestHelper.createCustomer("127.773.620-09");
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
        cpf: fakeCustomer.cpf.getFormattedCPF(),
      };

      const response = await server.post("/customers").send(request);

      expect(response.statusCode).toEqual(httpStatus.CONFLICT);
      expect(response.body).toHaveProperty("name", "Conflict");
      expect(response.body).toHaveProperty(
        "message",
        `The CPF '${request.cpf}' is already being used`
      );
    });
  });
});
