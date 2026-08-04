export function SanityCheck(job) {

  console.log(job);

    Object.keys(job).forEach((attribute) => {

      if(attribute === 'growth')
      {
        Object.keys(job[attribute]).forEach((stat) => {
          console.log(stat, job[attribute][stat].filter(n=> n===1).length);
        }); 
      }


      if(Array.isArray(job[attribute])) {
          console.log(attribute, job[attribute].filter(Boolean).length);
      }  


    });


}

//Check and make sure that the stats inside the text files are correct. 
//MINIMUM STAT GAINS
/*
STAT   Fighter    Thief     B. Belt     R. Mage     W. Mage     B. Mage
STR       49        33         24          25          18          13
AGI       35        32         25          17          18          13
INT       14        17         24          24          29          49
VIT       25        16         49          22          19          14
LCK       24        49         30          25          20          14
SHP	      27	      18	       20	         13	         15	         12
*/


export function sanityCheckSD(runs, averageStats, standardDeviationStats) {
  Object.keys(averageStats).forEach((stat) => { 
    var lower = averageStats[stat] - standardDeviationStats[stat];
    var upper = averageStats[stat] + standardDeviationStats[stat];
    // var counter = 0;
    // runs.forEach((run) => {
    //     if((run[stat] >= lower) && (run[stat] <= upper)) {
    //       counter++;
    //     }
    // });
    var withinBand = runs.filter((run) => run[stat] >= lower && run[stat] <= upper).length;
    var proportion = withinBand / runs.length;
    console.log(stat, (proportion * 100).toFixed(1) + "%");

  });


}
  



