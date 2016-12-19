import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Reaction, Logger } from "/server/api";
import { Notifications, Packages } from "/lib/collections";

/**
 * Reaction Notification methods
 */
Meteor.methods({
  /**
  * notification/send
  * @summary This send a notification to a user
  * @param {String} userId - The user
  * @param {String} type - The type of Notification
  * @param {String} url - url link
  * @param {Boolean} sms - sms enabled check.
  * @param {String} details - details of the Notification
  * @return {Object} returns result
  */
  "notification/send": function (userId, type, url, sms, details) {
    check(userId, String);
    check(type, String);
    check(sms, Boolean);
    check(details, Match.OptionalOrNull(String));
    check(url, String);

    const values = {};
    const types = {
      orderCancelled: "Your order was cancelled.",
      newOrder: "Your order is being processed.",
      topWallet: "Your wallet has been credited.",
      forAdmin: "You have a new order.",
      orderDelivered: "Your order has been delivered.",
      orderAccepted: "Your order has been accepted.",
      orderShipped: "Your order has been shipped."
    };

    if (userId && type && url) {
      values.type = type;
      values.to = userId;
      values.url = url;
      values.message = types[type];
      values.hasDetails = false;
      if (details) {
        values.hasDetails = true;
        values.details = details;
      }
    }

    if (sms) {
      Meteor.subscribe("Packages").ready();
      const result = Packages.find({ name: "reaction-sms", shopId: Reaction.getShopId()}).fetch();
      if (result[0].enabled === true) {
        Meteor.call("sms/send", values.message, userId, Reaction.getShopId(), (error) => {
          if (error) Logger.warn("Error: error occured while sending sms", error);
        });
      } else {
        Logger.info("Sms is not enabled");
      }
    }
    Logger.info(`Sending notification to ${userId}`);
    return Notifications.insert(values);
  },

  /**
   * notification/markOneAsRead
   * @summary This marks all user's notification as ready
   * @param {String} id - The notification id
   * @return {Object} returns cursor
   */
  "notification/markOneAsRead": (id) => {
    check(id, String);

    return Notifications.update({_id: id}, {
      $set: {
        status: "read"
      }
    });
  },

  /**
   * notification/delete
   * @summary This deletes a notification
   * @param {String} id - The notification id
   * @return {Object} return cursor
   */
  "notification/delete": (id) => {
    check(id, String);

    return Notifications.remove({ _id: id });
  }
});
