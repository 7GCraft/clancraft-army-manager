const { replenishUnit } = require('./helper');

describe('replenishUnit', () => {
  test.each([
    ['Tier I Infantry', 'N', 10, 74],
    ['Tier II Cavalry', 'N', 10, 34],
    ['Tier III Siege', 'N', 10, 26],
    ['Ship', 'N', 0, 0.4],
  ])('replenishes %s using the default location modifier', (tier, status, currentSize, expected) => {
    expect(replenishUnit(tier, status, currentSize)).toBe(expected);
  });

  test('uses allied location modifier', () => {
    expect(replenishUnit('Tier I Infantry', 'A', 10)).toBe(58);
  });

  test('uses enemy location modifier', () => {
    expect(replenishUnit('Tier I Infantry', 'E', 10)).toBe(10);
  });

  test('caps replenished size at the unit maximum', () => {
    expect(replenishUnit('Tier I Infantry', 'N', 150)).toBe(160);
  });
});
