import { describe, it, expect } from 'vitest';
import { run } from './run';

/**
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
* Stiffness: 1-5 ($15 per point)
* Size: [148, 157, 157W, 160, 160W, 163W] ($10 extra for 160 or larger, $15 for W)
* Sidewall Text: string value ($20 extra)
*/

describe('cart transform function', () => {
  it('adds cost for everything', () => {
    const result = run({/* TODO: Add test input */});

    const expectedPrice = 100 + (5 * 15) + 10 + 15 + 20;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it('adds cost for stiffness', () => {
    const result = run({/* TODO: Add test input */});
    
    const expectedPrice = 100 + (3 * 15);
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it ('adds cost for size >= 160', () => {
    const result = run({/* TODO: Add test input */});

    const expectedPrice = 100 + 10;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it ('adds cost for size ends with W', () => {
    const result = run({/* TODO: Add test input */});

    const expectedPrice = 100 + 15;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

  it('adds cost for sidewall text', () => {
    const result = run({/* TODO: Add test input */});

    const expectedPrice = 100 + 20;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });

});