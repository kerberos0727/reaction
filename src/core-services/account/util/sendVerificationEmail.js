import _ from "lodash";
import generateVerificationTokenObject from "@reactioncommerce/api-utils/generateVerificationTokenObject.js";
import ReactionError from "@reactioncommerce/reaction-error";
import config from "../config.js";

const { REACTION_IDENTITY_PUBLIC_VERIFY_EMAIL_URL } = config;

/**
 * @method sendVerificationEmail
 * @summary Send an email with a link the user can use verify their email address.
 * @param {Object} context Startup context
 * @param {Object} input Input options
 * @param {String} input.userId - The id of the user to send email to.
 * @param {String} [input.bodyTemplate] Template name for rendering the email body
 * @returns {Job} - returns a sendEmail Job instance
 */
export default async function sendVerificationEmail(context, { bodyTemplate = "accounts/verifyEmail", userId }) {
  const { collections } = context;
  const { Accounts, Shops, users } = collections;

  const user = await users.findOne({ _id: userId });
  if (!user) throw new ReactionError("not-found", `User ${userId} not found`);

  const account = await Accounts.findOne({ userId });
  if (!account) throw new ReactionError("not-found", "Account not found");

  const { address } = _.find(user.emails || [], (item) => !item.verified) || {};

  if (!address) {
    // No unverified email addresses found
    return null;
  }

  const tokenObj = generateVerificationTokenObject({ address });

  await users.updateOne({ _id: userId }, {
    $push: {
      "services.email.verificationTokens": tokenObj
    }
  });

  // Account emails are always sent from the primary shop email and using primary shop
  // email templates.
  const shop = await Shops.findOne({ shopType: "primary" });
  if (!shop) throw new ReactionError("not-found", "Shop not found");

  const dataForEmail = {
    // Reaction Information
    contactEmail: _.get(shop, "emails[0].address"),
    homepage: _.get(shop, "storefrontUrls.storefrontHomeUrl", null),
    copyrightDate: new Date().getFullYear(),
    legalName: _.get(shop, "addressBook[0].company"),
    physicalAddress: {
      address: `${_.get(shop, "addressBook[0].address1")} ${_.get(shop, "addressBook[0].address2")}`,
      city: _.get(shop, "addressBook[0].city"),
      region: _.get(shop, "addressBook[0].region"),
      postal: _.get(shop, "addressBook[0].postal")
    },
    shopName: shop.name,
    confirmationUrl: REACTION_IDENTITY_PUBLIC_VERIFY_EMAIL_URL.replace("TOKEN", tokenObj.token),
    userEmailAddress: address
  };

  const language = (account.profile && account.profile.language) || shop.language;

  return context.mutations.sendEmail(context, {
    data: dataForEmail,
    fromShop: shop,
    templateName: bodyTemplate,
    language,
    to: address
  });
}
