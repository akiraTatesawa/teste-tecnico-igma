// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";

import { ExpressApp } from "@infra/http/app";
import { PrismaDatabase } from "@infra/data/databases/prisma/config/prisma.database";
import { CustomerTestHelper } from "./helpers/customer-helper";

describe("GET /customers", () => {
  const server = supertest(new ExpressApp().app);

  beforeEach(async () => {
    await new PrismaDatabase().cleanDb();

    await Promise.all([
      CustomerTestHelper.createCustomer("088.662.850-48"),
      CustomerTestHelper.createCustomer("605.820.310-44"),
      CustomerTestHelper.createCustomer("593.583.350-68"),
      CustomerTestHelper.createCustomer("571.925.470-69"),
    ]);
  });

  describe("Success", () => {
    it("[200::OK] Should be able to get all the customers", async () => {
      const response = await server.get("/customers");

      expect(response.statusCode).toEqual(httpStatus.OK);
      expect(response.body).toHaveProperty("customers", expect.any(Array));
      expect(response.body.customers).toHaveLength(4);
    });

    it("[200::OK] Should be able to set a Limit", async () => {
      const limit = 2;
      const response = await server.get(`/customers?limit=${limit}`);

      expect(response.statusCode).toEqual(httpStatus.OK);
      expect(response.body).toHaveProperty("customers", expect.any(Array));
      expect(response.body.customers).toHaveLength(2);
    });

    it("[200::OK] Should be able to set an Offset", async () => {
      const offset = 1;
      const response = await server.get(`/customers?offset=${offset}`);

      expect(response.statusCode).toEqual(httpStatus.OK);
      expect(response.body).toHaveProperty("customers", expect.any(Array));
      expect(response.body.customers).toHaveLength(3);
    });
  });

  describe("Failure", () => {
    it("[400::BAD_REQUEST] Should return an error if the Limit is invalid", async () => {
      const limit = "a";
      const response = await server.get(`/customers?limit=${limit}`);

      expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty("name", "Bad Request");
      expect(response.body).toHaveProperty(
        "message",
        "Limit and Offset must be non-negative numbers"
      );
    });

    it("[400::BAD_REQUEST] Should return an error if the Offset is invalid", async () => {
      const offset = "a";
      const response = await server.get(`/customers?offset=${offset}`);

      expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty("name", "Bad Request");
      expect(response.body).toHaveProperty(
        "message",
        "Limit and Offset must be non-negative numbers"
      );
    });
  });
});
