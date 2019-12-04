import mockContext from "@reactioncommerce/api-utils/tests/mockContext.js";
import groupsQuery from "./groups.js";

const fakeShopId = "FAKE_SHOP_ID";
const fakeAccount = { _id: "FAKE_ACCOUNT_ID", groups: ["group1", "group2"] };

beforeEach(() => {
  jest.resetAllMocks();
});

test("returns the groups cursor if userHasPermissionLegacy returns true", async () => {
  mockContext.collections.Groups.find.mockReturnValueOnce("CURSOR");
  mockContext.userHasPermissionLegacy.mockReturnValueOnce(true);
  const result = await groupsQuery(mockContext, fakeShopId);
  expect(mockContext.collections.Groups.find).toHaveBeenCalledWith({ shopId: fakeShopId });
  expect(mockContext.userHasPermissionLegacy).toHaveBeenCalledWith(["owner", "admin", "reaction-accounts"], null, { shopId: fakeShopId });
  expect(result).toBe("CURSOR");
});

test("returns the groups cursor for groups the current user is in, if userHasPermissionLegacy returns false", async () => {
  mockContext.collections.Groups.find.mockReturnValueOnce("CURSOR");
  mockContext.userHasPermissionLegacy.mockReturnValueOnce(false);
  mockContext.collections.Accounts.findOne.mockReturnValueOnce(fakeAccount);
  const result = await groupsQuery(mockContext, fakeShopId);
  expect(mockContext.collections.Groups.find).toHaveBeenCalledWith({
    _id: { $in: fakeAccount.groups },
    shopId: fakeShopId
  });
  expect(mockContext.userHasPermissionLegacy).toHaveBeenCalledWith(["owner", "admin", "reaction-accounts"], null, { shopId: fakeShopId });
  expect(result).toBe("CURSOR");
});

test("throws access-denied if not allowed", async () => {
  mockContext.userHasPermissionLegacy.mockReturnValueOnce(false);
  mockContext.collections.Accounts.findOne.mockReturnValueOnce(undefined);
  const result = groupsQuery(mockContext, fakeShopId);
  return expect(result).rejects.toThrowErrorMatchingSnapshot();
});
