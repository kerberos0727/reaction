import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";

export const ShippoPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.api_key": {
      type: String,
      label: "API Key",
      min: 10,
      optional: true
    }
  }
]);
