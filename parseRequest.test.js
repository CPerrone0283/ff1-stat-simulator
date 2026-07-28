import test from 'node:test';
import assert from 'node:assert/strict';
import { processInputs } from './parseRequest.js';

//rawRunCount variable 1
//rawMaxLevel variable 2

test('level 1.3 is rejected', () => {
    const result = processInputs(10, 1.3);
    assert.equal(result.ok, false);
    assert.equal(result.field, 'level');

});

test('Valid Max Level', () => {

    const results = processInputs(10, 50);
    assert.equal(results.ok, true);
    assert.equal(results.values.maxLevel, 50);

});

test('Level Above 50', () => {

    const overLevelFifty = processInputs(10, 51);
    assert.equal(overLevelFifty.ok, false);
    assert.equal(overLevelFifty.field, 'level');
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

test('Run Count must be 1 or greater', () => {
    const lessThanOneRun = processInputs(0.999, 40);
    assert.equal(lessThanOneRun.ok, false);
    assert.equal(lessThanOneRun.field, 'runs');
});

test('Valid Max Run Count 100000', () => {

    const results = processInputs(100000, 50);
    assert.equal(results.ok, true);
    assert.equal(results.values.runCount, 100000);


});

test('Runs Must Not Exceed 100000', () => {

    const results = processInputs(100001, 50);
    assert.equal(results.ok, false);
    assert.equal(results.field, 'runs');

});

test('Valid Minimal Test', () => {

    const result = processInputs(1, 2);
    assert.equal(result.ok, true);
    assert.equal(result.values.runCount, 1);
    assert.equal(result.values.maxLevel, 2);

});


test('Run Valid Decimal Numbers', () => { 
    const results = processInputs(98.6, 49.8);
    assert.equal(results.ok, true);
    assert.equal(results.values.runCount, 99);
    assert.equal(results.values.maxLevel, 50);



});





