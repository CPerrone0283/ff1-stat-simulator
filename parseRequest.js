export const MIN_LEVEL = 2;
export const MAX_LEVEL = 50;

export const MIN_RUNCOUNT = 1;
export const MAX_RUNCOUNT = 100000;


export function processInputs(rawRunCount, rawMaxLevel) {



    if(!Number.isFinite(rawMaxLevel) || rawMaxLevel > MAX_LEVEL || rawMaxLevel < MIN_LEVEL)
    {
        return { ok: false, message: `Level should be between ${MIN_LEVEL} and ${MAX_LEVEL}.`, field: 'level' };
    }


    if(!Number.isFinite(rawRunCount) || rawRunCount > MAX_RUNCOUNT || rawRunCount < MIN_RUNCOUNT)
    {
        return { ok: false, message: `Run count must be between ${MIN_RUNCOUNT} and  ${MAX_RUNCOUNT}.`, field: 'runs' };
    }

    const runCount = Math.round(rawRunCount);
    const maxLevel = Math.round(rawMaxLevel);


    return { ok: true, values: { runCount, maxLevel } };


}