export class StatSheet {

    constructor(runs) {
        this.statNames = Object.keys(runs[0]);

        const totals = this.zeroStats(this.statNames);
        const average = this.zeroStats(this.statNames);
        const highest = {...runs[0]};
        const lowest = {...runs[0]};
        const standardDeviation = this.zeroStats(this.statNames);

        const statistics = { average, highest, lowest, standardDeviation };



        runs.forEach((run) => {
            this.statNames.forEach((stat) => {
               totals[stat] += run[stat]; 
               highest[stat] = highest[stat] < run[stat] ? run[stat] : highest[stat];
               lowest[stat] = lowest[stat] > run[stat] ? run[stat] : lowest[stat];
            });
        });


        this.statNames.forEach((stat) => {
            average[stat] = totals[stat] / runs.length;   // precise, no floor
        });

        const squaredDiffs = this.zeroStats(this.statNames);
        runs.forEach((run) => {
            this.statNames.forEach((stat) => {
                const squared = Math.pow(run[stat] - average[stat], 2);
                squaredDiffs[stat] += squared;
            });
        });

        this.statNames.forEach((stat) => {
            standardDeviation[stat] = Math.sqrt(squaredDiffs[stat] / runs.length)
        });

        this.typeNames = Object.keys(statistics);
        Object.assign(this, statistics);



    }

    zeroStats(names) {
        const blankSheet = {};
        names.forEach(stat => {
            blankSheet[stat] = 0;
        });

        return blankSheet;

    }
    
    

}