// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";

import { ExpressApp } from "@infra/http/app";
import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { CustomerTestHelper } from "./helpers/customer-helper";

describe("GET /customers/:customerCPF", () => {
  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await new PrismaDatabase().cleanDb();
  });

  describe("Success", () => {
    it("[200::OK] Should be able to list a Customer by CPF", async () => {
      const validCPF = "167.800.080-95";
      const customer = await CustomerTestHelper.createCustomer(validCPF);

      const response = await server.get(`/customers/${validCPF}`);

      expect(response.statusCode).toEqual(httpStatus.OK);
      expect(response.body).toHaveProperty("customer", expect.any(Object));
      expect(response.body).toHaveProperty("customer.id", expect.any(String));
      expect(response.body).toHaveProperty("customer.name", customer.name.value);
      expect(response.body).toHaveProperty("customer.cpf", validCPF);
      expect(response.body).toHaveProperty("customer.birthday", customer.birthday.stringValue);
      expect(response.body).toHaveProperty("customer.registrationDate", expect.any(String));
    });
  });

  describe("Failure", () => {
    it("[422::UNPROCESSABLE_ENTITY] Should return an error if the CPF is invalid", async () => {
      const invalidCPF = "12731213123123132";

      const response = await server.get(`/customers/${invalidCPF}`);

      expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body).toHaveProperty("name", "Unprocessable Entity");
      expect(response.body).toHaveProperty(
        "message",
        "The CPF must follow the patterns '99999999900' or '999.999.999-00'"
      );
    });

    it("[404::NOT_FOUND] Should return an error if the Customer does not exist", async () => {
      const validCPF = "167.800.080-95";

      const response = await server.get(`/customers/${validCPF}`);

      expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty("name", "Not Found");
      expect(response.body).toHaveProperty("message", "Customer not found");
    });
  });
});
