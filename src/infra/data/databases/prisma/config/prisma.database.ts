import { PrismaClient } from "@prisma/client";

export class PrismaDatabase {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient({ errorFormat: "pretty" });
  }

  public get customer() {
    return this._prisma.prismaCustomer;
  }

  public async cleanDb(): Promise<void> {
    await this._prisma.$queryRaw`TRUNCATE TABLE customers CASCADE`;
  }
}

export const prisma = new PrismaDatabase();
