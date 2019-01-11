import mockContext, { mockCollection } from "/imports/test-utils/helpers/mockContext";
import updateSurchargeMutation from "./updateSurcharge";


// Create mock context with Surcharges collection
mockContext.collections.Surcharges = mockCollection("Surcharges");
mockContext.userHasPermission.mockReturnValueOnce(true);

const surcharge = {
  type: "surcharge",
  attributes: [
    { property: "vendor", value: "reaction", propertyType: "string", operator: "eq" },
    { property: "productType", value: "knife", propertyType: "string", operator: "eq" }
  ],
  destination: { region: ["CO", "NY"] },
  amount: {
    amount: 5.99,
    currencyCode: "USD"
  },
  message: "Original Message",
  reason: "Original Reason"
};

const updatedSurcharge = {
  type: "surcharge",
  attributes: [
    { property: "vendor", value: "john", propertyType: "string", operator: "eq" },
    { property: "productType", value: "gun", propertyType: "string", operator: "eq" }
  ],
  destination: { region: ["NJ", "WY"] },
  amount: {
    amount: 17.99,
    currencyCode: "USD"
  },
  message: "Updated Message",
  reason: "Updated Reason"
};

test("update a surcharge", async () => {
  mockContext.collections.Surcharges.updateOne.mockReturnValueOnce(Promise.resolve({
    ok: 1,
    updatedSurcharge
  }));

  const result = await updateSurchargeMutation(mockContext, {
    surcharge,
    surchargeId: "surcharge123",
    shopId: "shop123"
  });

  expect(result).toEqual({
    surcharge: {
      type: "surcharge",
      attributes: [
        { property: "vendor", value: "reaction", propertyType: "string", operator: "eq" },
        { property: "productType", value: "knife", propertyType: "string", operator: "eq" }
      ],
      destination: { region: ["CO", "NY"] },
      amount: {
        amount: 5.99,
        currencyCode: "USD"
      },
      message: "Original Message",
      reason: "Original Reason"
    }
  });
});
