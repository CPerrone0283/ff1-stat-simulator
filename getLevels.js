// import { jobs } from './classes.js'
import { readFileSync } from 'fs';
// import { simulate } from './simulator.js'
// import { StatSheet } from './statSheet.js'




export function parseAllJobs(jobs) {
  Object.keys(jobs).forEach((job) => {
      var levelData = getLevelData(job);
      addLevelData(jobs[job], levelData);
});
return jobs;
}



function getLevelData(className) {
    const data = readFileSync(`./classes/${className}.txt`, 'utf8');
    var levels = data.split(/\r?\n/);
    return levels;
}


function addLevelData(className, levelData) {

      levelData.forEach((stats, index) => {

        let level = index + 2;

        className.strongHp[level] = stats.includes('+') ? true : false;
        className.growth.str[level] = stats.includes('S') ? 1 : 0;
        className.growth.agi[level] = stats.includes('A') ? 1 : 0;
        className.growth.vit[level] = stats.includes('V') ? 1 : 0;
        className.growth.int[level] = stats.includes('I') ? 1 : 0;
        className.growth.luck[level] = stats.includes('L') ? 1 : 0;


      })


}


