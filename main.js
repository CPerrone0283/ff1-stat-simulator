import { writeFileSync } from 'fs';
import { parseAllJobs } from './getLevels.js';
import { jobs } from './classes.js';

const filledJobs = parseAllJobs(jobs);

writeFileSync('./data/classData.js', 'export const jobs = ' + JSON.stringify(filledJobs, null, 2) + ';');