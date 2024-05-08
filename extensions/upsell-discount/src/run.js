// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Discount} Discount
 */


/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /**
   * @type {{ total: number, offered: string, discount: number, quantity: number }[]}
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
      console.log(`Skipping offer ${offer.offered} because total is less than ${offer.total}`);
      continue;
    }

    for (const line of input.cart.lines) {
      if (line.isUpsell?.value !== 'true') {
        console.log(`Skipping line ${line.id} because it is not an upsell`);
        continue;
      }

      if (line.merchandise.__typename !== "ProductVariant")  {
        console.log(`Skipping line ${line.id} because it is not a product variant`);
        continue;
      }

      if (line.merchandise.product.id !== offer.offered) {
        console.log(`Skipping line ${line.id} because it is not the product ${offer.offered}`);
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