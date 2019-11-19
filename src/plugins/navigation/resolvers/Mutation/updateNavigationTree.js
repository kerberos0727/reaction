import { decodeNavigationTreeOpaqueId, decodeShopOpaqueId } from "../../xforms/id.js";

/**
 * @name Mutation.updateNavigationTree
 * @method
 * @memberof Navigation/GraphQL
 * @summary resolver for updateNavigationTree GraphQL mutation
 * @param {Object} parentResult Unused
 * @param {Object} args.input An object of all mutation arguments that were sent by the client
 * @param {String} args.input.id ID of the navigation tree to update
 * @param {String} args.input.shopId Shop ID of the navigation tree to publish changes
 * @param {String} args.input.navigationTree The updated navigation tree
 * @param {Object} context An object containing the per-request state
 * @param {String} [args.input.clientMutationId] An optional string identifying the mutation call
 * @returns {Promise<Object>} UpdateNavigationTreePayload
 */
export default async function updateNavigationTree(parentResult, { input }, context) {
  const {
    clientMutationId = null,
    id: opaqueNavigationTreeId,
    shopId: opaqueShopId,
    navigationTree
  } = input;

  const navigationTreeId = decodeNavigationTreeOpaqueId(opaqueNavigationTreeId);
  const shopId = decodeShopOpaqueId(opaqueShopId);
  const updatedNavigationTree = await context.mutations.updateNavigationTree(context, {
    shopId,
    navigationTreeId,
    navigationTree
  });

  return {
    clientMutationId,
    navigationTree: updatedNavigationTree
  };
}
