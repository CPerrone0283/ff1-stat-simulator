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
    it('Minimum runs is 1', () => {
        assert.equal(MIN_RUNCOUNT, 1);
    });
    it('Accepts the Maximum Run Count', () => {
        const result = processInputs(MAX_RUNCOUNT, 50);
        assert.equal(result.ok, true);
        assert.equal(result.values.runCount, MAX_RUNCOUNT);
    });
    it('Accepts the Minimum Run Count', () => {
        const result = processInputs(MIN_RUNCOUNT, 50);
        assert.equal(result.ok, true);
        assert.equal(result.values.runCount, MIN_RUNCOUNT);
    });
    it('Rejects one run above the maximum', () => {
        const result = processInputs(MAX_RUNCOUNT + 1, 50);
        assert.equal(result.ok, false);
        assert.equal(result.field, 'runs');
    });
    it('Rejects one run below the minimum', () => {
        const result = processInputs(MIN_RUNCOUNT - 1, 50);
        assert.equal(result.ok, false);
        assert.equal(result.field, 'runs');
    });

});

describe('Test Level Caps', () => {
    it('Maximum level is 50', () => {
        assert.equal(MAX_LEVEL, 50);
    });
    it('Minimum level is 2', () => {
        assert.equal(MIN_LEVEL, 2);
    });
    it('Accepts the Maximum level', () => {
        const result = processInputs(10, MAX_LEVEL);
        assert.equal(result.ok, true);
        assert.equal(result.values.maxLevel, MAX_LEVEL);
    });
    it('Accepts the Minimum level', () => {
        const result = processInputs(10, MIN_LEVEL);
        assert.equal(result.ok, true);
        assert.equal(result.values.maxLevel, MIN_LEVEL);
    });
    it('Rejects one level above the maximum', () => {
        const result = processInputs(10, MAX_LEVEL + 1);
        assert.equal(result.ok, false);
        assert.equal(result.field, 'level');
    });
    it('Rejects one level below the minimum', () => {
        const result = processInputs(10, MIN_LEVEL - 1);
        assert.equal(result.ok, false);
        assert.equal(result.field, 'level');
    });

});


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

test('Valid Minimal Test', () => {

    const result = processInputs(1, 2);
    assert.equal(result.ok, true);
    assert.equal(result.values.runCount, 1);
    assert.equal(result.values.maxLevel, 2);

});

test('zero for both', () => {

    const result = processInputs(0,0);
    assert.equal(result.ok, false);
    //level should be the first to fail
    assert.equal(result.field, 'level');

});



