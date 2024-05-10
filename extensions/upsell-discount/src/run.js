// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Discount} Discount
 * @typedef {import("../../../lib/types").UpsellOfferConfiguration} UpsellOfferConfiguration
 */


/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /**
   * @type {UpsellOfferConfiguration}
   */
  const configuration = JSON.parse(
    input?.shop?.offers?.value ?? "{}"
  );

  /**
   * @type {Discount[]}
   */
  var discounts = [];
  for (const offer of configuration) {
    if (input.cart.cost.subtotalAmount.amount < offer.total) {
      continue;
    }

    for (const line of input.cart.lines) {
      if (line.isUpsell?.value !== 'true') {
        continue;
      }

      if (line.merchandise.__typename !== "ProductVariant")  {
        continue;
      }

      if (line.merchandise.product.id !== offer.offered) {
        continue;
      }

      discounts.push({
        targets: [{
          cartLine: {
            id: line.id,
            quantity: offer.quantity
          }
        }],
        value: {
          percentage: {
            value: offer.discount
          }
        }
      })
    }

  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.All,
    discounts
  };
};