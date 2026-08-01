import test from 'node:test';
import assert from 'node:assert/strict';
import { jobs } from './data/classData.js'
import { getProperName } from './formatting/getProperName.js'
import { describe, it } from 'node:test';


test('fighter returns Fighter', () => {
    const fighter = getProperName("fighter");
    assert.equal(fighter, "Fighter");
});


test('redMage returns Red Mage', () => {
    const redMage = getProperName("redMage");
    assert.equal(redMage, "Red Mage");
});

test('bigBlackBelt returns Big Black Belt if the /g flag is on', () => {
    const bigBlackBelt = getProperName("bigBlackBelt");
    assert.equal(bigBlackBelt, "Big Black Belt");
});

test('All lower case should not work', () => {
    const whiteMage = getProperName("whitemage");
    assert.notEqual(whiteMage, "white mage");
    assert.notEqual(whiteMage, "White Mage");
});


describe('Each job in jobs should also work here', () => {
    for (const job of Object.keys(jobs)) {
        it(`${job} formats cleanly`, () => {
            const jobName = getProperName(job);
            assert.equal(jobName.startsWith(' '), false);
            assert.match(jobName, /^[A-Z]/);
            assert.doesNotMatch(jobName, /[a-z][A-Z]/);
        });
    }
});
