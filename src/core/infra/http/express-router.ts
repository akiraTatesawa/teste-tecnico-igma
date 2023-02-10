import * as express from "express";

export abstract class ExpressRouter {
  public readonly expressRouter: express.Router;

  constructor() {
    this.expressRouter = express.Router();

    this.configRouter();
  }

  protected abstract configRouter(): void;
}
