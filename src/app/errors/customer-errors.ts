// eslint-disable-next-line max-classes-per-file
export namespace CustomerErrors {
  export class CPFNotUniqueError extends Error {
    constructor(cpf: string) {
      super(`The CPF '${cpf}' is already being used`);
    }
  }

  export class NotFoundError extends Error {
    constructor() {
      super("Customer not found");
    }
  }

  export class InvalidParamsError extends Error {}
}
