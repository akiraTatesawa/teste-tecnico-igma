import { CreateCustomerDTO } from "@app/dtos/create-customer.dto";
import { InMemoryTestCustomerRepository } from "@tests/repositories/in-memory-customer-repository";
import { EntityErrors } from "@app/errors/entity-errors";
import { CustomerFactory } from "@tests/factories/customer-factory";
import { CustomerErrors } from "@app/errors/customer-errors";
import { CreateCustomerImpl } from "./create-customer.use-case";

describe("Create Customer Use Case", () => {
  let sut: CreateCustomerImpl;
  let customerRepository: InMemoryTestCustomerRepository;

  beforeEach(() => {
    customerRepository = new InMemoryTestCustomerRepository();
    sut = new CreateCustomerImpl(customerRepository);
  });

  describe("Success", () => {
    it("Should be able to create a Customer", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
        cpf: "888.958.000-36",
      };

      const response = await sut.execute(request);

      expect(response.isRight()).toEqual(true);
      expect(response.result).toHaveProperty("id");
      expect(response.result).toHaveProperty("name");
      expect(response.result).toHaveProperty("birthday");
      expect(response.result).toHaveProperty("cpf");
      expect(response.result).toHaveProperty("createdAt", expect.any(Date));
      expect(customerRepository.customers).toHaveLength(1);
    });
  });

  describe("Failure", () => {
    it("Should return an error if the CPF has an invalid format", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
        cpf: "invalid_format",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty(
        "message",
        "The CPF must follow the patterns '99999999900' or '999.999.999-00'"
      );
    });

    it("Should return an error if the CPF is invalid", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "01/09/1999",
        cpf: "99999999900",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty("message", "Invalid CPF");
    });

    it("Should return an error if the Name is an empty string", async () => {
      const request: CreateCustomerDTO = {
        name: "",
        birthday: "01/09/1999",
        cpf: "888.958.000-36",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty("message", "Customer Name cannot be an empty string");
    });

    it("Should return an error if the Name has an invalid format", async () => {
      const request: CreateCustomerDTO = {
        name: "123 invalid name",
        birthday: "01/09/1999",
        cpf: "888.958.000-36",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty(
        "message",
        "Customer Name must consist of only letters"
      );
    });

    it("Should return an error if the Name is longer than 60 char", async () => {
      const request: CreateCustomerDTO = {
        name: "Name".repeat(40),
        birthday: "01/09/1999",
        cpf: "888.958.000-36",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty(
        "message",
        "Customer Name cannot be longer than 60 char"
      );
    });

    it("Should return an error if the Birthday is invalid", async () => {
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "909090",
        cpf: "888.958.000-36",
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(EntityErrors.EntityCreationError);
      expect(response.result).toHaveProperty(
        "message",
        "The Birthday must follow the pattern 'DD/MM/YYYY'"
      );
    });

    it("Should return an error if the CPF (unmasked) is already being used", async () => {
      const fakeCustomer = CustomerFactory.generateCustomer();
      await customerRepository.insert(fakeCustomer);
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "09/02/2019",
        cpf: fakeCustomer.cpf.value,
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.CPFNotUniqueError);
      expect(response.result).toHaveProperty(
        "message",
        `The CPF '${fakeCustomer.cpf.getFormattedCPF()}' is already being used`
      );
    });

    it("Should return an error if the CPF (unmasked) is already being used", async () => {
      const fakeCustomer = CustomerFactory.generateCustomer();
      await customerRepository.insert(fakeCustomer);
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "09/02/2019",
        cpf: fakeCustomer.cpf.value,
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.CPFNotUniqueError);
      expect(response.result).toHaveProperty(
        "message",
        `The CPF '${fakeCustomer.cpf.getFormattedCPF()}' is already being used`
      );
    });

    it("Should return an error if the CPF (masked) is already being used", async () => {
      const fakeCustomer = CustomerFactory.generateCustomer();
      await customerRepository.insert(fakeCustomer);
      const request: CreateCustomerDTO = {
        name: "Fake Customer Name",
        birthday: "09/02/2019",
        cpf: fakeCustomer.cpf.getFormattedCPF(),
      };

      const response = await sut.execute(request);

      expect(response.isLeft()).toEqual(true);
      expect(response.result).toBeInstanceOf(CustomerErrors.CPFNotUniqueError);
      expect(response.result).toHaveProperty(
        "message",
        `The CPF '${fakeCustomer.cpf.getFormattedCPF()}' is already being used`
      );
    });
  });
});
