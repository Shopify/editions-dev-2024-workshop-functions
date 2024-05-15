import { describe, it, expect } from 'vitest';
import { run } from './run';

/**
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

describe('cart transform function', () => {
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

  it('adds cost for everything', () => {
    const result = run({/* TODO: Add test input */});

    const expectedPrice = 100 + (5 * 15) + 10 + 15 + 20;
    expect(result.operations[0].update.price.adjustment.fixedPricePerUnit.amount).toEqual(expectedPrice);
  });
});