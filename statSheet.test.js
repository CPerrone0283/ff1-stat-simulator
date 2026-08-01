import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StatSheet } from './statSheet.js';


describe('eight runs: 2, 4, 4, 4, 5, 5, 7, 9', ()=> {
    const runs = [2, 4, 4, 4, 5, 5, 7, 9].map(v => ({ str: v }));
    const sheet = new StatSheet(runs);

    it('averages to 5', () => { assert.equal(sheet.average.str, 5); });
    it('highest is 9', () => { assert.equal(sheet.highest.str, 9); });
    it('lowest is 2', () =>  { assert.equal(sheet.lowest.str, 2); });
    it('standard deviation of 2', () => { assert.equal(sheet.standardDeviation.str, 2); });

});

test('Highest Lowest Average should be the same', () => {
    const runs = [5].map(v => ({ str: v, agi: v, vit: v, int: v, luck: v }));
    const sheet = new StatSheet(runs);

    assert.deepEqual(sheet.average, { str: 5, agi: 5, vit: 5, int: 5, luck: 5});
    assert.deepEqual(sheet.lowest, { str: 5, agi: 5, vit: 5, int: 5, luck: 5});
    assert.deepEqual(sheet.highest, { str: 5, agi: 5, vit: 5, int: 5, luck: 5});
    assert.equal(sheet.standardDeviation.str, 0);
});

test('Test Negative Values', () => {
    const runs = [-5, -3, -9].map(v => ({ str: v }));
    const sheet = new StatSheet(runs);

    assert.equal(sheet.highest.str, -3);
    assert.equal(sheet.lowest.str, -9);
});

test('typeNames and statNames are correct', () => {
    const runs = [2, 4, 4, 4, 5, 5, 7, 9].map(v => ({ str: v, agi: v, vit: v, int: v, luck: v }));
    const sheet = new StatSheet(runs);

    const typeNames = ['average', 'highest', 'lowest', 'standardDeviation'];
    const statNames = ['str','agi','vit','int','luck'];

    assert.deepStrictEqual(sheet.typeNames, typeNames);
    assert.deepStrictEqual(sheet.statNames, statNames);

});