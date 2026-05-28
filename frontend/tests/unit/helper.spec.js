import {
  calculateUnitSize,
  calculateUpkeep,
  compareUnits,
  findBaseUpkeep,
  findRecruitmentCost,
  generateOrdinalIndicator,
  groupBy,
  sortObjectKeys,
} from '@/helper';

describe('frontend helpers', () => {
  test('calculateUpkeep coerces values to numbers before adding', () => {
    expect(calculateUpkeep('12', '3')).toBe(15);
  });

  test('findBaseUpkeep returns the matching upkeep reference value', () => {
    expect(findBaseUpkeep('Tier I Infantry', { 'Tier I Infantry': 8 })).toBe(8);
  });

  test('findRecruitmentCost returns the matching recruitment reference value', () => {
    expect(findRecruitmentCost('Tier II Cavalry', { 'Tier II Cavalry': 50 })).toBe(50);
  });

  test('groupBy groups items by the requested property', () => {
    const units = [
      { Tier: 'Infantry', Name: 'A' },
      { Tier: 'Cavalry', Name: 'B' },
      { Tier: 'Infantry', Name: 'C' },
    ];

    expect(groupBy(units, 'Tier')).toEqual({
      Cavalry: [{ Tier: 'Cavalry', Name: 'B' }],
      Infantry: [
        { Tier: 'Infantry', Name: 'A' },
        { Tier: 'Infantry', Name: 'C' },
      ],
    });
  });

  test.each([
    ['Tier I Infantry', 160],
    ['Tier II Cavalry', 60],
    ['Tier III Siege', 40],
    ['Ship', 1],
  ])('calculateUnitSize returns %i for %s', (tier, size) => {
    expect(calculateUnitSize(tier)).toBe(size);
  });

  test.each([
    [1, 'st'],
    [2, 'nd'],
    [3, 'rd'],
    [4, 'th'],
    [11, 'th'],
    [12, 'th'],
    [13, 'th'],
    [21, 'st'],
    [102, 'nd'],
  ])('generateOrdinalIndicator returns %s for %i', (number, indicator) => {
    expect(generateOrdinalIndicator(number)).toBe(indicator);
  });

  test('sortObjectKeys returns a new object with alphabetized keys', () => {
    expect(sortObjectKeys({ z: 1, a: 2, m: 3 })).toEqual({ a: 2, m: 3, z: 1 });
  });

  test('compareUnits sorts units by Number ascending', () => {
    const units = [{ Number: 3 }, { Number: 1 }, { Number: 2 }];

    expect(units.sort(compareUnits)).toEqual([{ Number: 1 }, { Number: 2 }, { Number: 3 }]);
  });
});
