export interface CustomerViewModel {
  customer: {
    id: string;
    name: string;
    birthday: string;
    cpf: string;
    registrationDate: string;
  };
}

export interface ManyCustomersViewModel {
  customers: {
    id: string;
    name: string;
    birthday: string;
    cpf: string;
    registrationDate: string;
  }[];
}
