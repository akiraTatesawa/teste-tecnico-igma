import { ValueObject } from "@core/domain/value-object";
import { Either, left, right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-errors";

interface CustomerBirthdayProps {
  stringValue: string;
  dateValue: Date;
}

type CustomerBirthdayCreateResult = Either<DomainErrors.InvalidPropsError, CustomerBirthday>;

export class CustomerBirthday extends ValueObject<CustomerBirthdayProps> {
  private constructor(props: CustomerBirthdayProps) {
    super(props);
  }

  public get stringValue(): string {
    return this._props.stringValue;
  }

  public get dateValue(): Date {
    return this._props.dateValue;
  }

  private static convertToDate(birthday: string): Date {
    const day = birthday.slice(0, 2);
    const month = birthday.slice(3, 5);
    const year = birthday.slice(6);

    return new Date(`${month}/${day}/${year}`);
  }

  private static convertToString(birthday: Date): string {
    const day: number = birthday.getUTCDate();
    const month: number = birthday.getUTCMonth() + 1;
    const year: number = birthday.getUTCFullYear();

    let formattedDay: string;
    if (day < 10) {
      formattedDay = `0${day}`;
    } else {
      formattedDay = `${day}`;
    }

    let formattedMonth: string;
    if (month < 10) {
      formattedMonth = `0${month}`;
    } else {
      formattedMonth = `${month}`;
    }

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  public static createFromString(birthdayString: string): CustomerBirthdayCreateResult {
    const dateRegex: RegExp = /^(3[01]|[12][0-9]|0[1-9])\/(1[0-2]|0[1-9])\/[0-9]{4}$/gm;

    if (!birthdayString.match(dateRegex)) {
      return left(
        new DomainErrors.InvalidPropsError("The Birthday must follow the pattern 'DD/MM/YYYY'")
      );
    }

    const dateValue = CustomerBirthday.convertToDate(birthdayString);
    const customerBirthday = new CustomerBirthday({
      stringValue: birthdayString,
      dateValue,
    });

    return right(customerBirthday);
  }

  public static createFromDate(birthdayDate: Date): CustomerBirthdayCreateResult {
    const stringValue = CustomerBirthday.convertToString(birthdayDate);
    const customerBirthday = new CustomerBirthday({
      stringValue,
      dateValue: birthdayDate,
    });

    return right(customerBirthday);
  }
}
