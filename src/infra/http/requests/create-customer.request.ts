import * as express from "express";
import { CreateCustomerDTO } from "@app/dtos/create-customer.dto";

export interface CreateCustomerRequest extends express.Request {
  body: CreateCustomerDTO;
}
