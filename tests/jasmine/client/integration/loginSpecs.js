/*
 * client integration tests for layouts
 * integration tests are those that check client
 * interactions with the server
 */

let signUp;

signUp = function (user, callback) {
  $(".dropdown-toggle").trigger("click");
  $("#signup-link").trigger("click");
  $("#login-email").val(user.email);
  $("#login-password").val(user.password);
  $("#login-buttons-password").trigger("click");
  callback;
};

describe("User signup", function () {
  let user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  it("should return a meteor userId users by one", function () {
    signUp(user);
    expect(Meteor.userId()).not.toBeNull;
  });

  it("should automatically log-in new user", function () {
    expect(Meteor.userId()).not.toBeNull;
  });
});
