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
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  return NO_CHANGES;
};