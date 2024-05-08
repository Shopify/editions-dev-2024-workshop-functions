// @ts-check

/**
 * Calculates the price of a custom snowboard based on stiffness, size, and snowstopper option.
 * 
 * Stiffness: 1-5 ($15 per point)
 * Size: [148, 157, 157W, 160, 160W, 163W] ($10 extra for 160 or larger, $15 for W)
 * Sidewall Text: string value ($20 extra)
 * 
 */


/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /** @type {CartOperation[]} */
  const operations = [];
  
  for (const line of input.cart.lines) {
    if (line.merchandise.__typename !== "ProductVariant") {
      continue;
    }

    if (!line.merchandise.product.isSnowboard) {
      continue;
    }

    if (!line.stiffness && !line.size && !line.sidewallText) {
      continue;
    }

    const title = `${line.merchandise.product.title} - Customized`;
    let price = line.cost.amountPerQuantity.amount;
    
    //TODO: Add to price based on customization options
    
    operations.push({
      update: {
        cartLineId: line.id,
        title,
        price: {
          adjustment: {
            fixedPricePerUnit: {
              amount: price
            }
          }
        }
      }
    })
  }

  return {
    operations
  }
};