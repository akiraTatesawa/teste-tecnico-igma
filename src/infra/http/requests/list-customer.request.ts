import * as express from "express";

export interface ListCustomerRequest extends express.Request {
  params: {
    customerCPF: string;
  };
}

export interface ListManyCustomersRequest extends express.Request {
  query: {
    limit: string;
    offset: string;
  };
}
