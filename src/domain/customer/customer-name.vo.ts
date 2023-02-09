import { ValueObject } from "@core/domain/value-object";
import { Either, right, left } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-errors";

interface CustomerNameProps {
  value: string;
}

type CustomerNameCreateResult = Either<DomainErrors.InvalidPropsError, CustomerName>;

export class CustomerName extends ValueObject<CustomerNameProps> {
  private constructor(props: CustomerNameProps) {
    super(props);
  }

  public get value(): string {
    return this._props.value;
  }

  private static validate(name: string): Either<DomainErrors.InvalidPropsError, null> {
    if (name.length === 0) {
      return left(new DomainErrors.InvalidPropsError("Customer Name cannot be an empty string"));
    }

    const nameRegex = /^[\p{L}\s]+$/gu;

    if (!name.match(nameRegex)) {
      return left(new DomainErrors.InvalidPropsError("Customer Name must consist of only letters"));
    }

    if (name.length > 60) {
      return left(
        new DomainErrors.InvalidPropsError("Customer Name cannot be longer than 60 char")
      );
    }

    return right(null);
  }

  public static create(name: string): CustomerNameCreateResult {
    const validationResult = CustomerName.validate(name);

    if (validationResult.isLeft()) {
      const validationError = validationResult.result;

      return left(validationError);
    }

    const customerName = new CustomerName({ value: name });

    return right(customerName);
  }
}
