import * as express from "express";

export interface CreateCustomerRequest extends express.Request {
  body: {
    name: string;
    cpf: string;
    birthday: string;
  };
}
