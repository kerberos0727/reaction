Package.describe({
  summary: "Reaction Accounts - Authentication UI for Reaction Commerce",
  name: "reactioncommerce:reaction-accounts",
  version: "0.1.0",
  git: "https://github.com/reactioncommerce/reaction-accounts"
});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.0');

  // Core Meteor packages
  api.use("meteor-platform@1.2.1");
  api.use("random");
  api.use("reactive-var");
  api.use("reactive-dict");
  api.use("oauth-encryption");
  api.use("accounts-base");
  api.use("accounts-password");
  api.use("accounts-oauth");
  api.use("accounts-facebook");
  api.use("accounts-ui");
  api.use("coffeescript");
  api.use("less");

  // Core Reaction packages

  // api.addFiles([
  //   "common/routing.coffee",
  // ],["client","server"]);

  api.addFiles([

    // core login form and generic templates
    "client/templates/login/loginForm.html",
    "client/templates/login/loginButtons.html",
    "client/templates/loginForm.js",

    // sign in
    "client/templates/signIn/signIn.html",
    "client/templates/signIn/signIn.js",

    // sign in
    "client/templates/signUp/signUp.html",
    "client/templates/signUp/signUp.js",

    // reset password
    "client/templates/forgot/forgot.html",
    "client/templates/forgot/forgot.js",

    // basic styles
    "client/templates/loginForm.less"


  ],
  ["client"]);

});


Package.onTest(function(api) {
  api.use('sanjo:jasmine@0.14.0');
  api.use('velocity:html-reporter@0.7.0');
  api.use('velocity:console-reporter@0.1.2');

  api.addFiles('tests/jasmine/client/unit/login.js', 'client');
});
