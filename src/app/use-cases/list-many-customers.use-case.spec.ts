import { Customer } from "@domain/customer/customer.entity";
import { CustomerFactory } from "@tests/factories/customer-factory";
import { InMemoryTestCustomerRepository } from "@tests/repositories/in-memory-customer-repository";
import { ListManyCustomersFilters } from "@app/dtos/pagination.dto";
import { CustomerErrors } from "@app/errors/customer-errors";
import { ListManyCustomers, ListManyCustomersImpl } from "./list-many-customers.use-case";

describe("List Many Customers Use Case", () => {
  let sut: ListManyCustomers;
  let customerRepository: InMemoryTestCustomerRepository;

  let customer: Customer;

  beforeEach(async () => {
    customerRepository = new InMemoryTestCustomerRepository();
    sut = new ListManyCustomersImpl(customerRepository);

    customer = CustomerFactory.generateCustomer();

    await Promise.all([
      customerRepository.insert(customer),
      customerRepository.insert(customer),
      customerRepository.insert(customer),
      customerRepository.insert(customer),
      customerRepository.insert(customer),
      customerRepository.insert(customer),
      customerRepository.insert(customer),
      customerRepository.insert(customer),
    ]);
  });

  describe("Success", () => {
    it("Should be able to list all the customers", async () => {
      const response = await sut.execute({});

      expect(response.isRight()).toEqual(true);
      expect(response.isLeft()).toEqual(false);
      expect(response.result).toBeInstanceOf(Array);
      expect(response.result).toHaveLength(8);
    });

    it("Should be able to set an offset when listing the customers", async () => {
      const request: ListManyCustomersFilters = {
        offset: "2",
      };

      const response = await sut.execute(request);

      expect(response.isRight()).toEqual(true);
      expect(response.isLeft()).toEqual(false);
      expect(response.result).toBeInstanceOf(Array);
      expect(response.result).toHaveLength(6);
    });

    it("Should be able to set a limit when listing the customers", async () => {
      const request: ListManyCustomersFilters = {
        limit: "1",
      };

      const response = await sut.execute(request);

      expect(response.isRight()).toEqual(true);
      expect(response.isLeft()).toEqual(false);
      expect(response.result).toBeInstanceOf(Array);
      expect(response.result).toHaveLength(1);
    });

    it("Should be able to set a limit and an offset when listing the customers", async () => {
      const request: ListManyCustomersFilters = {
        limit: "4",
        offset: "2",
      };

      const response = await sut.execute(request);

      expect(response.isRight()).toEqual(true);
      expect(response.isLeft()).toEqual(false);
      expect(response.result).toBeInstanceOf(Array);
      expect(response.result).toHaveLength(4);
    });

    it("Should return an empty array if the offset is greater than the customers array length", async () => {
      const request: ListManyCustomersFilters = {
        limit: "4",
        offset: "90",
      };

      const response = await sut.execute(request);

      expect(response.isRight()).toEqual(true);
      expect(response.isLeft()).toEqual(false);
      expect(response.result).toBeInstanceOf(Array);
      expect(response.result).toHaveLength(0);
    });
  });

  describe("Failure", () => {
    it("Should return na error if the limit is not a numeric string", async () => {
      const request: ListManyCustomersFilters = {
        limit: "invalid limit",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.InvalidParamsError);
      expect(response.result).toHaveProperty(
        "message",
        "Limit and Offset must be non-negative numbers"
      );
    });

    it("Should return na error if the limit is a negative numeric string", async () => {
      const request: ListManyCustomersFilters = {
        limit: "-10",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.InvalidParamsError);
      expect(response.result).toHaveProperty(
        "message",
        "Limit and Offset must be non-negative numbers"
      );
    });

    it("Should return na error if the offset is not a numeric string", async () => {
      const request: ListManyCustomersFilters = {
        offset: "invalid limit",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.InvalidParamsError);
      expect(response.result).toHaveProperty(
        "message",
        "Limit and Offset must be non-negative numbers"
      );
    });

    it("Should return na error if the offset is a negative numeric string", async () => {
      const request: ListManyCustomersFilters = {
        offset: "-10",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.InvalidParamsError);
      expect(response.result).toHaveProperty(
        "message",
        "Limit and Offset must be non-negative numbers"
      );
    });
  });
});
