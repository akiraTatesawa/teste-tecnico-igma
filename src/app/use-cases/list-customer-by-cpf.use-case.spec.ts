import { ListCustomerByCPFDto } from "@app/dtos/list-customer.dto";
import { CustomerErrors } from "@app/errors/customer-errors";
import { EntityErrors } from "@app/errors/entity-errors";
import { Customer } from "@domain/customer/customer.entity";
import { CustomerFactory } from "@tests/factories/customer-factory";
import { InMemoryTestCustomerRepository } from "@tests/repositories/in-memory-customer-repository";
import { ListCustomerByCPF, ListCustomerByCPFImpl } from "./list-customer-by-cpf.use-case";

describe("List Customer By CPF", () => {
  let sut: ListCustomerByCPF;
  let customerRepository: InMemoryTestCustomerRepository;

  let customer: Customer;

  beforeEach(() => {
    customerRepository = new InMemoryTestCustomerRepository();
    sut = new ListCustomerByCPFImpl(customerRepository);

    customer = CustomerFactory.generateCustomer();
  });

  describe("Success", () => {
    it("Should be able to get a Customer by CPF", async () => {
      await customerRepository.insert(customer);
      const request: ListCustomerByCPFDto = {
        cpf: customer.cpf.value,
      };

      const response = await sut.execute(request);

      expect(response.isRight()).toEqual(true);
      expect(response.result).toHaveProperty("id", customer.id);
      expect(response.result).toHaveProperty("name", customer.name.value);
      expect(response.result).toHaveProperty("birthday", customer.birthday.stringValue);
      expect(response.result).toHaveProperty("cpf", customer.cpf.getFormattedCPF());
      expect(response.result).toHaveProperty("createdAt", customer.createdAt);
    });
  });

  describe("Failure", () => {
    it("Should return an error if the CPF format is invalid", async () => {
      const request: ListCustomerByCPFDto = {
        cpf: "invalid cpf",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty(
        "message",
        "The CPF must follow the patterns '99999999900' or '999.999.999-00'"
      );
    });

    it("Should return an error if the CPF digits are invalid", async () => {
      const request: ListCustomerByCPFDto = {
        cpf: "220.645.570-69",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty("message", "Invalid CPF");
    });

    it("Should return an error if the customer does not exist", async () => {
      const request: ListCustomerByCPFDto = {
        cpf: "220.645.570-67",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.NotFoundError);
      expect(response.result).toHaveProperty("message", "Customer not found");
    });
  });
});
