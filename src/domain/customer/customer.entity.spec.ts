import { DomainErrors } from "@domain/errors/domain-errors";
import { randomUUID } from "node:crypto";
import { CustomerBirthday } from "./customer-birthday.vo";
import { CustomerCPF } from "./customer-cpf.vo";
import { CustomerName } from "./customer-name.vo";
import { CreateCustomerProps, Customer } from "./customer.entity";

describe("Customer Entity", () => {
  describe("Success", () => {
    it("Should be able to create a Customer", () => {
      const customerProps: CreateCustomerProps = {
        name: "Fake Customer Name",
        birthday: "10/09/2000",
        cpf: "690.141.340-88",
      };

      const customerOrError = Customer.create(customerProps);

      expect(customerOrError.isRight()).toEqual(true);
      expect(customerOrError.result).toBeInstanceOf(Customer);
      expect(customerOrError.result).toHaveProperty("name", expect.any(CustomerName));
      expect(customerOrError.result).toHaveProperty("name.value", customerProps.name);
      expect(customerOrError.result).toHaveProperty("cpf", expect.any(CustomerCPF));
      expect(customerOrError.result).toHaveProperty("cpf.value", customerProps.cpf);
      expect(customerOrError.result).toHaveProperty("birthday", expect.any(CustomerBirthday));
      expect(customerOrError.result).toHaveProperty("birthday.stringValue", customerProps.birthday);
      expect(customerOrError.result).toHaveProperty("id", expect.any(String));
      expect(customerOrError.result).toHaveProperty("createdAt", expect.any(Date));
    });

    it("Should be able to reconstitute a Customer", () => {
      const customerProps: CreateCustomerProps = {
        name: "Fake Customer Name",
        birthday: "10/09/2000",
        cpf: "690.141.340-88",
        id: randomUUID(),
        createdAt: new Date(),
      };

      const customerOrError = Customer.create(customerProps);

      expect(customerOrError.isRight()).toEqual(true);
      expect(customerOrError.result).toBeInstanceOf(Customer);
      expect(customerOrError.result).toHaveProperty("name", expect.any(CustomerName));
      expect(customerOrError.result).toHaveProperty("name.value", customerProps.name);
      expect(customerOrError.result).toHaveProperty("cpf", expect.any(CustomerCPF));
      expect(customerOrError.result).toHaveProperty("cpf.value", customerProps.cpf);
      expect(customerOrError.result).toHaveProperty("birthday", expect.any(CustomerBirthday));
      expect(customerOrError.result).toHaveProperty("birthday.stringValue", customerProps.birthday);
      expect(customerOrError.result).toHaveProperty("id", customerProps.id);
      expect(customerOrError.result).toHaveProperty("createdAt", customerProps.createdAt);
    });
  });

  describe("Failure", () => {
    it("Should return an error if the CPF is invalid", () => {
      const customerProps: CreateCustomerProps = {
        cpf: "invalid",
        name: "Fake Customer Name",
        birthday: "10/09/2000",
      };

      const customerOrError = Customer.create(customerProps);

      expect(customerOrError.isLeft()).toEqual(true);
      expect(customerOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerOrError.result).toHaveProperty(
        "message",
        "The CPF must follow the patterns '99999999900' or '999.999.999-00'"
      );
    });

    it("Should return an error if the Name is invalid", () => {
      const customerProps: CreateCustomerProps = {
        cpf: "690.141.340-88",
        name: "12341231231",
        birthday: "10/09/2000",
      };

      const customerOrError = Customer.create(customerProps);

      expect(customerOrError.isLeft()).toEqual(true);
      expect(customerOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerOrError.result).toHaveProperty(
        "message",
        "Customer Name must consist of only letters"
      );
    });

    it("Should return an error if the Birthday is invalid", () => {
      const customerProps: CreateCustomerProps = {
        name: "Fake Customer Name",
        birthday: "39",
        cpf: "690.141.340-88",
      };

      const customerOrError = Customer.create(customerProps);

      expect(customerOrError.isLeft()).toEqual(true);
      expect(customerOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerOrError.result).toHaveProperty(
        "message",
        "The Birthday must follow the pattern 'DD/MM/YYYY'"
      );
    });
  });
});
