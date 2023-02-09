import { Entity } from "@core/domain/entity";
import { Either, right, left } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-errors";
import { CustomerBirthday } from "./customer-birthday.vo";
import { CustomerCPF } from "./customer-cpf.vo";
import { CustomerName } from "./customer-name.vo";

interface CustomerProps {
  name: CustomerName;
  cpf: CustomerCPF;
  birthday: CustomerBirthday;
  createdAt: Date;
}

export interface CreateCustomerProps {
  id?: string;
  name: string;
  cpf: string;
  birthday: string;
  createdAt?: Date;
}

type CreateCustomerResult = Either<DomainErrors.InvalidPropsError, Customer>;

export class Customer extends Entity<CustomerProps> {
  private constructor(props: CustomerProps, id?: string) {
    super(props, id);
  }

  public get name(): CustomerName {
    return this._props.name;
  }

  public get cpf(): CustomerCPF {
    return this._props.cpf;
  }

  public get birthday(): CustomerBirthday {
    return this._props.birthday;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public static create(props: CreateCustomerProps): CreateCustomerResult {
    const { birthday, cpf, name, createdAt, id } = props;

    const customerCPFOrError = CustomerCPF.create(cpf);

    if (customerCPFOrError.isLeft()) {
      const cpfError = customerCPFOrError.result;
      return left(cpfError);
    }

    const customerNameOrError = CustomerName.create(name);

    if (customerNameOrError.isLeft()) {
      const nameError = customerNameOrError.result;
      return left(nameError);
    }

    const customerBirthdayOrError = CustomerBirthday.createFromString(birthday);

    if (customerBirthdayOrError.isLeft()) {
      const birthdayError = customerBirthdayOrError.result;
      return left(birthdayError);
    }

    const customerName: CustomerName = customerNameOrError.result;
    const customerBirthday: CustomerBirthday = customerBirthdayOrError.result;
    const customerCPF: CustomerCPF = customerCPFOrError.result;

    const customer = new Customer(
      {
        name: customerName,
        cpf: customerCPF,
        birthday: customerBirthday,
        createdAt: createdAt ?? new Date(),
      },
      id
    );

    return right(customer);
  }
}
