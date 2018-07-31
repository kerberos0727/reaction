import { check } from "meteor/check";
import { Reaction } from "/lib/api";
import ReactionError from "/imports/plugins/core/graphql/server/no-meteor/ReactionError";
import { Packages } from "/lib/collections";

/**
 * @name shop/togglePackage
 * @method
 * @memberof Shop/Methods
 * @summary enable/disable Reaction package
 * @param {String} packageId - package _id
 * @param {Boolean} enabled - current package `enabled` state
 * @return {Number} mongo update result
 */
export default function togglePackage(packageId, enabled) {
  check(packageId, String);
  check(enabled, Boolean);

  if (!Reaction.hasAdminAccess()) {
    throw new ReactionError("access-denied", "Access Denied");
  }

  return Packages.update(packageId, {
    $set: {
      enabled: !enabled
    }
  });
}
