import { DomainErrors } from "@domain/errors/domain-errors";
import { randVerb } from "@ngneat/falso";
import { CustomerName } from "./customer-name.vo";

describe("Customer Name Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a Customer Name without an error", () => {
      const name = "Fake Customer Name";

      const customerNameOrError = CustomerName.create(name);

      expect(customerNameOrError.isRight()).toEqual(true);
      expect(customerNameOrError.result).toBeInstanceOf(CustomerName);
      expect(customerNameOrError.result).toHaveProperty("value", name);
    });
  });

  describe("Failure", () => {
    it("Should return an error if the name is an empty string", () => {
      const emptyName = "";

      const customerNameOrError = CustomerName.create(emptyName);

      expect(customerNameOrError.isLeft()).toEqual(true);
      expect(customerNameOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerNameOrError.result).toHaveProperty(
        "message",
        "Customer Name cannot be an empty string"
      );
    });

    it("Should return an error if the name is not composed of only letters", () => {
      const invalidName = "1234 Fake Name";

      const customerNameOrError = CustomerName.create(invalidName);

      expect(customerNameOrError.isLeft()).toEqual(true);
      expect(customerNameOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerNameOrError.result).toHaveProperty(
        "message",
        "Customer Name must consist of only letters"
      );
    });

    it("Should return an error if the name is longer than 60 char", () => {
      const largeName = randVerb({ length: 40 }).join("");

      const customerNameOrError = CustomerName.create(largeName);

      expect(customerNameOrError.isLeft()).toEqual(true);
      expect(customerNameOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerNameOrError.result).toHaveProperty(
        "message",
        "Customer Name cannot be longer than 60 char"
      );
    });
  });
});
