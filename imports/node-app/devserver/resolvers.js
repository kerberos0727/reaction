import { merge } from "lodash";
import accounts from "/imports/plugins/core/accounts/server/no-meteor/resolvers";
import cart from "/imports/plugins/core/cart/server/no-meteor/resolvers";
import catalog from "/imports/plugins/core/catalog/server/no-meteor/resolvers";
import core from "/imports/plugins/core/core/server/no-meteor/resolvers";
import orders from "/imports/plugins/core/orders/server/no-meteor/resolvers";
import payments from "/imports/plugins/core/payments/server/no-meteor/resolvers";
import product from "/imports/plugins/core/product/server/no-meteor/resolvers";
import shipping from "/imports/plugins/core/shipping/server/no-meteor/resolvers";
import marketplace from "/imports/plugins/included/marketplace/server/no-meteor/resolvers";
import paymentsExample from "/imports/plugins/included/payments-example/server/no-meteor/resolvers";
import paymentsStripe from "/imports/plugins/included/payments-stripe/server/no-meteor/resolvers";
import shippingRates from "/imports/plugins/included/shipping-rates/server/no-meteor/resolvers";

export default merge(
  {},
  accounts,
  cart,
  catalog,
  core,
  orders,
  payments,
  product,
  shipping,
  marketplace,
  paymentsExample,
  paymentsStripe,
  shippingRates
);
