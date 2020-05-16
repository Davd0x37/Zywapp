import {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  ObjectLiteral,
  EventSubscriber,
  getMetadataArgsStorage,
} from "typeorm";
import { decrypt, encrypt } from "@/components/crypto";
import { ColumnMetadataArgs } from "typeorm/metadata-args/ColumnMetadataArgs";
import { default_encryption_key } from "@/config/vault";

const getColumnsToEncrypt = (entity: ObjectLiteral): ColumnMetadataArgs[] =>
  getMetadataArgsStorage().columns.filter(
    ({ target, options }: any) => target == entity.constructor && options.encryption,
  );

const enc = async (entity: ObjectLiteral) => {
  await Promise.all(
    getColumnsToEncrypt(entity).map(async ({ propertyName }) => {
      entity[propertyName] = await encrypt(entity[propertyName], default_encryption_key);
    }),
  );
};

const dec = async (entity: ObjectLiteral) => {
  await Promise.all(
    getColumnsToEncrypt(entity).map(async ({ propertyName }) => {
      entity[propertyName] = await decrypt(entity[propertyName], default_encryption_key);
    }),
  );
};

@EventSubscriber()
export class ColumnEncryption implements EntitySubscriberInterface {
  // public constructor() {}

  public async beforeInsert(event: InsertEvent<ObjectLiteral>): Promise<void> {
    if (event.entity != undefined) {
      await enc(event.entity);
    }
  }
  public async beforeUpdate(event: UpdateEvent<ObjectLiteral>): Promise<void> {
    if (event.entity != undefined) {
      await enc(event.entity);
    }
  }

  public async afterLoad(entity: ObjectLiteral /*, event?: LoadEvent<ObjectLiteral>*/): Promise<void> {
    if (entity != undefined) {
      await dec(entity);
    }
  }
}
