import { Column, ColumnOptions } from "typeorm";
import { EncryptionOptions } from "@/decorators/encryption/interface";

export const Encrypt = (options: ColumnOptions & EncryptionOptions) => {
  options.encryption = true;
  return Column(options);
};
