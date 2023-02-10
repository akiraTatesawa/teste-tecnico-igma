import * as express from "express";

export class ExpressFactory {
  public static createMockResponse(): express.Response {
    const res = {} as express.Response;

    res.status = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  }
}
