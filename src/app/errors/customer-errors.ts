export namespace CustomerErrors {
  export class CPFNotUniqueError extends Error {
    constructor(cpf: string) {
      super(`The CPF '${cpf}' is already being used`);
    }
  }
}
