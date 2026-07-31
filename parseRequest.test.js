import test from 'node:test';
import assert from 'node:assert/strict';
import { processInputs, MIN_LEVEL, MAX_LEVEL, MIN_RUNCOUNT, MAX_RUNCOUNT } from './parseRequest.js';
import { describe, it } from 'node:test';

//rawRunCount variable 1
//rawMaxLevel variable 2


describe('Test Run Counts', () => {
    it('Maximum runs is 100000', () => {
        assert.equal(MAX_RUNCOUNT, 100000);
    });
    it('Accepts the Maximum Run Count', () => {
        assert.equal(processInputs(MAX_RUNCOUNT, 50).ok, true);
    });
    it('Rejects one run above the maximum', () => {
        assert.equal(processInputs(MAX_RUNCOUNT + 1, 50).ok, false);
    });
    it('Rejects one run below the minimum', () => {
        assert.equal(processInputs(MIN_RUNCOUNT - 1, 50).ok, false);
    });

});

describe('Test Level Caps', () => {
    it('Maximum level is 50', () => {
        assert.equal(MAX_LEVEL, 50);
    });
    it('accepts the maximum level', () => {
        assert.equal(processInputs(10, MAX_LEVEL).ok, true);
    });
    it('Rejects one level above the maximum', () => {
        assert.equal(processInputs(10, MAX_LEVEL + 1).ok, false);
    });
    it('Rejects one level below the minimum', () => {
        assert.equal(processInputs(10, MIN_LEVEL - 1).ok, false);
    });

});





// test('Valid Max Level', () => {

//     const results = processInputs(10, 50);
//     assert.equal(results.ok, true);
//     assert.equal(results.values.maxLevel, 50);

// });

// test('Level Above 50', () => {

//     const overLevelFifty = processInputs(10, 51);
//     assert.equal(overLevelFifty.ok, false);
//     assert.equal(overLevelFifty.field, 'level');
// });

test('Level Not a Number', () => {
    const resultLevelNumber = processInputs(10, Number("cat"));
    assert.equal(resultLevelNumber.ok, false);
    assert.equal(resultLevelNumber.field, 'level');
});


test('Runs Not a Number', () => {

    const resultRunsNumber = processInputs(Number("cat"), 50);
    assert.equal(resultRunsNumber.ok, false);
    assert.equal(resultRunsNumber.field, 'runs');
});



test('Run Valid Decimal Numbers', () => { 
    const results = processInputs(98.6, 49.8);
    assert.equal(results.ok, true);
    assert.equal(results.values.runCount, 99);
    assert.equal(results.values.maxLevel, 50);
});

test('level 1.3 is rejected', () => {
    const result = processInputs(10, 1.3);
    assert.equal(result.ok, false);
    assert.equal(result.field, 'level');

});

test('Decimal less than 1 run rejected', () => {
    const lessThanOneRun = processInputs(0.999, 40);
    assert.equal(lessThanOneRun.ok, false);
    assert.equal(lessThanOneRun.field, 'runs');
});





// test('Valid Max Run Count 100000', () => {

//     const results = processInputs(100000, 50);
//     assert.equal(results.ok, true);
//     assert.equal(results.values.runCount, 100000);


// });

// test('Runs Must Not Exceed 100000', () => {

//     const results = processInputs(100001, 50);
//     assert.equal(results.ok, false);
//     assert.equal(results.field, 'runs');

// });

test('Valid Minimal Test', () => {

    const result = processInputs(1, 2);
    assert.equal(result.ok, true);
    assert.equal(result.values.runCount, 1);
    assert.equal(result.values.maxLevel, 2);

});





