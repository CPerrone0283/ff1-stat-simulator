




export function simulate(classData, targetLevel) {
    let stats = {...classData.base};
    const statnames = Object.keys(classData.growth);
    //start at level 2, up to targetLevel
    for(let i = 2; i <= targetLevel; i++)
    {
        stats.hp = stats.hp + getHP(stats.vit, classData.strongHp[i]);
        //for base stats
        for(const stat of statnames)
        {
            stats[stat] = stats[stat] + getStat(classData.growth[stat], i);
        }
    }

    return stats;
}





function getHP(currentVIT, strongHPFlag) {
    //strong HP level UP
    if(strongHPFlag)
    {
        return weakHPGain(currentVIT) + strongHPGain();
    }
    //regular HP gain
    else
    {
        return weakHPGain(currentVIT);
    }



}

function weakHPGain(VIT)
{
    return Math.floor(VIT/4) + 1;
}

//numbers are hardcoded. Extra HP should be in the 20-25 range
function strongHPGain() {
    return Math.floor(Math.random() * (25-20 + 1) + 20);

}


function getStat(stat, index) {
    if(stat[index] === 1)
    {
        return 1;
    }
    else
    {
        if(Math.random() < 0.25)
        {
            return 1;
        }
        else 
        {
            return 0;
        }

    }
}