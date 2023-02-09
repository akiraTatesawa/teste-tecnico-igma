import { DomainErrors } from "@domain/errors/domain-errors";
import { CustomerCPF } from "./customer-cpf.vo";

describe("Customer CPF Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a Customer CPF with the pattern '99999999900'", () => {
      const cpf = "69014134088";

      const customerCPFOrError = CustomerCPF.create(cpf);

      expect(customerCPFOrError.isRight()).toEqual(true);
      expect(customerCPFOrError.result).toBeInstanceOf(CustomerCPF);
      expect(customerCPFOrError.result).toHaveProperty("value", cpf);
    });
    it("Should be able to create a Customer CPF with the pattern '999.999.999-00'", () => {
      const cpf = "690.141.340-88";

      const customerCPFOrError = CustomerCPF.create(cpf);

      expect(customerCPFOrError.isRight()).toEqual(true);
      expect(customerCPFOrError.result).toBeInstanceOf(CustomerCPF);
      expect(customerCPFOrError.result).toHaveProperty("value", cpf);
    });
  });

  describe("Failure", () => {
    it("Should return an error if the CPF has an invalid format", () => {
      const invalidCPF = "Invalid Format";

      const customerCPFOrError = CustomerCPF.create(invalidCPF);

      expect(customerCPFOrError.isLeft()).toEqual(true);
      expect(customerCPFOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerCPFOrError.result).toHaveProperty(
        "message",
        "The CPF must follow the patterns '99999999900' or '999.999.999-00'"
      );
    });

    it("Should return an error if the CPF is invalid", () => {
      const invalidCPF = "111.444.777-31";

      const customerCPFOrError = CustomerCPF.create(invalidCPF);

      expect(customerCPFOrError.isLeft()).toEqual(true);
      expect(customerCPFOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerCPFOrError.result).toHaveProperty("message", "Invalid CPF");
    });
  });
});
