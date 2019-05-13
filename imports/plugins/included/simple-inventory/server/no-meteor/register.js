import mutations from "./mutations";
import queries from "./queries";
import resolvers from "./resolvers";
import schemas from "./schemas";
import startup from "./startup";
import inventoryForProductConfigurations from "./utils/inventoryForProductConfigurations";

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionNodeApp} app The ReactionNodeApp instance
 * @return {undefined}
 */
export default async function register(app) {
  /**
   * Simple Inventory plugin
   * Isolates the get/set of inventory data to this plugin.
   */
  await app.registerPlugin({
    label: "Simple Inventory",
    name: "reaction-simple-inventory",
    functionsByType: {
      inventoryForProductConfigurations: [inventoryForProductConfigurations],
      startup: [startup]
    },
    graphQL: {
      resolvers,
      schemas
    },
    mutations,
    queries
  });
}
