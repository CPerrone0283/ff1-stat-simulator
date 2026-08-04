import { parseAllJobs } from './getLevels.js';
import { jobs } from './classes.js';
import { jobs as committed } from './data/classData.js';
import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';


const parsed = parseAllJobs(jobs);

// Minimum stat gains: the number of GUARANTEED (non-random) gains across all level-ups.
// Source: FF1 research, previously recorded only as a comment in utilities/sanityChecks.js
// where nothing compared against it. Typed from that table — NOT computed from the parser,
// which is what keeps this an independent check rather than a tautology.
const MINIMUM_GAINS = {
    fighter:   { str: 49, agi: 35, int: 14, vit: 25, luck: 24, strongHp: 27 },
    thief:     { str: 33, agi: 32, int: 17, vit: 16, luck: 49, strongHp: 18 },
    blackBelt: { str: 24, agi: 25, int: 24, vit: 49, luck: 30, strongHp: 20 },
    redMage:   { str: 25, agi: 17, int: 24, vit: 22, luck: 25, strongHp: 13 },
    whiteMage: { str: 18, agi: 18, int: 29, vit: 19, luck: 20, strongHp: 15 },
    blackMage: { str: 13, agi: 13, int: 49, vit: 14, luck: 14, strongHp: 12 },
};


function getCounts (job) {

    let actualStats = { str:0, agi:0, int:0, vit:0, luck:0, strongHp: 0 };


    Object.keys(job).forEach((attribute) => {

      if(attribute === 'growth')
      {
        Object.keys(job[attribute]).forEach((stat) => {
            actualStats[stat] = job[attribute][stat].filter(n => n === 1).length;
        });
      }


      if(Array.isArray(job[attribute])) {
            actualStats[attribute] = job[attribute].filter(Boolean).length;
      }


    });


    return actualStats;
}


describe('parseAllJobs produces the known minimal stat gains', () => {

    // Iterating MINIMUM_GAINS, not `parsed` — a job missing from the parse output then fails
    // its own named test instead of silently generating one test fewer.
    for (const [job, expected] of Object.entries(MINIMUM_GAINS)) {
        it(`${job} Stat Counts`, () => {
            assert.ok(parsed[job], `${job} is missing from the parse output`);
            assert.deepEqual(getCounts(parsed[job]), expected);
        });
    }

});


describe('the committed data/classData.js is not stale', () => {

    it('has the same job list as a fresh parse', () => {
        assert.deepEqual(Object.keys(committed), Object.keys(parsed));
    });

    for (const job of Object.keys(MINIMUM_GAINS)) {
        it(`${job} is identical to a fresh parse`, () => {
            assert.deepEqual(committed[job], parsed[job]);
        });
    }

});
