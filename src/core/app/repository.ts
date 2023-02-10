import { Entity } from "@core/domain/entity";

export interface Repository<Model extends Entity<any>> {
  insert(entity: Model): Promise<void>;
}
