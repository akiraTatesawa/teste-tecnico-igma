import * as express from "express";

export interface ListCustomerRequest extends express.Request {
  params: {
    customerCPF: string;
  };
}
