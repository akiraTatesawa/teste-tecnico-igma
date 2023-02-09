import { DomainErrors } from "@domain/errors/domain-errors";
import { CustomerBirthday } from "./customer-birthday.vo";

describe("Customer Birthday Value Object", () => {
  describe("Success", () => {
    it("Should be able to create a Customer Birthday from a String", () => {
      const birthday: string = "10/09/1999";

      const customerBirthdayOrError = CustomerBirthday.createFromString(birthday);

      expect(customerBirthdayOrError.isRight()).toEqual(true);
      expect(customerBirthdayOrError.result).toHaveProperty("stringValue", birthday);
      expect(customerBirthdayOrError.result).toHaveProperty("dateValue", expect.any(Date));
    });

    it("Should be able to create a Customer Birthday from a Date", () => {
      const birthday: Date = new Date("01/09/1999");

      const customerBirthdayOrError = CustomerBirthday.createFromDate(birthday);

      expect(customerBirthdayOrError.isRight()).toEqual(true);
      expect(customerBirthdayOrError.result).toHaveProperty("dateValue", birthday);
      expect(customerBirthdayOrError.result).toHaveProperty("stringValue", "09/01/1999");
    });
  });

  describe("Failure", () => {
    it("Should return an error if the birthday format is invalid", () => {
      const invalidBirthday = "Invalid Format";

      const customerBirthdayOrError = CustomerBirthday.createFromString(invalidBirthday);

      expect(customerBirthdayOrError.isLeft()).toEqual(true);
      expect(customerBirthdayOrError.result).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(customerBirthdayOrError.result).toHaveProperty(
        "message",
        "The Birthday must follow the pattern 'DD/MM/YYYY'"
      );
    });
  });
});
