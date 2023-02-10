import { Repository } from "@core/app/repository";
import { Customer } from "@domain/customer/customer.entity";

export interface CustomerPagination {
  skip: number;
  take?: number;
}

export interface CustomerRepository extends Repository<Customer> {
  findByCPF(cpf: string): Promise<Customer | null>;
  listAll(paginationArgs: CustomerPagination): Promise<Customer[]>;
}
