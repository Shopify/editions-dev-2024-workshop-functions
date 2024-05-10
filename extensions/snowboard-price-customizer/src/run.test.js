import { describe, it, expect } from 'vitest';
import { run } from './run';

/**
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

describe('cart transform function', () => {
  it('adds cost for stiffness', () => {
    const result = run({
      "cart": {
        "lines": [
          {
            "id": "gid://shopify/CartLine/9be2dd47-f135-4cbb-b6e9-f7c3ee1c2af3",
            "stiffness": {
              "value": "3"
            },
            "size": null,
            "sidewallText": null,
            "cost": {
              "amountPerQuantity": {
                "amount": "100.0"
              }
            },
            "merchandise": {
              "__typename": "ProductVariant",
              "product": {
                "title": "The Collection Snowboard: Hydrogen",
                "productType": "snowboard"
              }
            }
          }
        ]
      }
    });
    
    const expectedPrice = 100 + (3 * 15);
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it ('adds cost for size >= 160', () => {
    const result = run({
      "cart": {
        "lines": [
          {
            "id": "gid://shopify/CartLine/9be2dd47-f135-4cbb-b6e9-f7c3ee1c2af3",
            "stiffness": null,
            "size": {
              "value": "163"
            },
            "sidewallText": null,
            "cost": {
              "amountPerQuantity": {
                "amount": "100.0"
              }
            },
            "merchandise": {
              "__typename": "ProductVariant",
              "product": {
                "title": "The Collection Snowboard: Hydrogen",
                "productType": "snowboard"
              }
            }
          }
        ]
      }
    });

    const expectedPrice = 100 + 10;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it ('adds cost for size ends with W', () => {
    const result = run({
      "cart": {
        "lines": [
          {
            "id": "gid://shopify/CartLine/9be2dd47-f135-4cbb-b6e9-f7c3ee1c2af3",
            "stiffness": null,
            "size": {
              "value": "157W"
            },
            "sidewallText": null,
            "cost": {
              "amountPerQuantity": {
                "amount": "100.0"
              }
            },
            "merchandise": {
              "__typename": "ProductVariant",
              "product": {
                "title": "The Collection Snowboard: Hydrogen",
                "productType": "snowboard"
              }
            }
          }
        ]
      }
    });

    const expectedPrice = 100 + 15;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it('adds cost for sidewall text', () => {
    const result = run({
      "cart": {
        "lines": [
          {
            "id": "gid://shopify/CartLine/9be2dd47-f135-4cbb-b6e9-f7c3ee1c2af3",
            "stiffness": null,
            "size": null,
            "sidewallText": {
              "value": "Custom Text"
            },
            "cost": {
              "amountPerQuantity": {
                "amount": "100.0"
              }
            },
            "merchandise": {
              "__typename": "ProductVariant",
              "product": {
                "title": "The Collection Snowboard: Hydrogen",
                "productType": "snowboard"
              }
            }
          }
        ]
      }
    });

    const expectedPrice = 100 + 20;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it('adds cost for everything', () => {
    const result = run({
      "cart": {
        "lines": [
          {
            "id": "gid://shopify/CartLine/9be2dd47-f135-4cbb-b6e9-f7c3ee1c2af3",
            "stiffness": {
              "value": "5"
            },
            "size": {
              "value": "163W"
            },
            "sidewallText": {
              "value": "Custom Text"
            },
            "cost": {
              "amountPerQuantity": {
                "amount": "100.0"
              }
            },
            "merchandise": {
              "__typename": "ProductVariant",
              "product": {
                "title": "The Collection Snowboard: Hydrogen",
                "productType": "snowboard"
              }
            }
          }
        ]
      }
    });

    const expectedPrice = 100 + (5 * 15) + 10 + 15 + 20;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });
});