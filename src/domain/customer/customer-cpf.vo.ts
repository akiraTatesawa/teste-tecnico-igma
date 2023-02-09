import { ValueObject } from "@core/domain/value-object";
import { Either, left, right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-errors";

interface CustomerCPFProps {
  value: string;
}

type CustomerCPFCreateResult = Either<DomainErrors.InvalidPropsError, CustomerCPF>;

export class CustomerCPF extends ValueObject<CustomerCPFProps> {
  private constructor(props: CustomerCPFProps) {
    super(props);
  }

  public get value(): string {
    return this._props.value;
  }

  private static calculateDigit(digits: number[]): number {
    const sum: number = digits.reduce((prev, curr, index, array) => {
      const factor = array.length + 1 - index;

      return prev + factor * curr;
    }, 0);

    if (sum % 11 < 2) {
      return 0;
    }

    return 11 - (sum % 11);
  }

  private static validateDigits(cpf: string): Either<DomainErrors.InvalidPropsError, null> {
    const unformattedCPF: string = cpf.replaceAll(/[.|-]/g, "");
    const firstNineDigits: number[] = unformattedCPF
      .slice(0, 9)
      .split("")
      .map((digit) => parseInt(digit, 10));

    const tenthDigit = CustomerCPF.calculateDigit(firstNineDigits);
    const eleventhDigit = CustomerCPF.calculateDigit([...firstNineDigits, tenthDigit]);

    if (
      `${tenthDigit}` !== unformattedCPF.charAt(9) ||
      `${eleventhDigit}` !== unformattedCPF.charAt(10)
    ) {
      return left(new DomainErrors.InvalidPropsError("Invalid CPF"));
    }

    return right(null);
  }

  private static validate(cpf: string): Either<DomainErrors.InvalidPropsError, null> {
    const cpfRegex: RegExp = /^([0-9]{11})|([0-9]{3}[.][0-9]{3}[.][0-9]{3}[-][0-9]{2})/gm;

    if (!cpf.match(cpfRegex)) {
      return left(
        new DomainErrors.InvalidPropsError(
          "The CPF must follow the patterns '99999999900' or '999.999.999-00'"
        )
      );
    }

    const digitsValidation = CustomerCPF.validateDigits(cpf);

    if (digitsValidation.isLeft()) {
      return left(digitsValidation.result);
    }

    return right(null);
  }

  public static create(cpf: string): CustomerCPFCreateResult {
    const cpfValidationResult = CustomerCPF.validate(cpf);

    if (cpfValidationResult.isLeft()) {
      const validationError = cpfValidationResult.result;

      return left(validationError);
    }

    const unformattedCPF: string = cpf.replaceAll(/[.|-]/g, "");
    const customerCPF = new CustomerCPF({ value: unformattedCPF });

    return right(customerCPF);
  }

  public getFormattedCPF(): string {
    const unformattedCPF: string = this._props.value;
    const formattedCPF = unformattedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");

    return formattedCPF;
  }
}
