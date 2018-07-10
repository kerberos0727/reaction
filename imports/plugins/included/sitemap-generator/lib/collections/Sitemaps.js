import { Mongo } from "meteor/mongo";
import { SitemapsSchema } from "./schemas/SitemapsSchema";

/**
 * @name Sitemaps
 * @memberof Collections
 * @summary Collection for auto-generated XML sitemaps
 */
export const Sitemaps = new Mongo.Collection("Sitemaps");

Sitemaps.attachSchema(SitemapsSchema);
