import { jobs } from './data/classData.js'
import { StatSheet } from './statSheet.js'
import { simulate } from './simulator.js'
import { processInputs } from './parseRequest.js';
import { getProperName } from './formatting/getProperName.js'
import { SanityCheck } from './utilities/sanityChecks.js';


const doSimulation = document.getElementById("doSimulation");
doSimulation.addEventListener('click', performSimulation);

const simulateClassMenu = document.getElementById("selectClassToSimulate");

const formats = {  
  average: (v) => Math.round(v),
  highest: (v) => v, 
  lowest: (v) => v,
  standardDeviation: (v) => v.toFixed(2)};

Object.keys(jobs).forEach((job, index) => {
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = 'class';
  radio.value = job;
  radio.id = job;
  if(index === 0) { radio.checked = true;  }
  const label = document.createElement('label');
  label.htmlFor = job;
  const name = getProperName(job);
  label.textContent = name;


  simulateClassMenu.appendChild(radio);
  simulateClassMenu.appendChild(label);
})

function performSimulation() {
    const runs = [];
    const selected = document.querySelector('input[name="class"]:checked').value;
    const inputTotalRuns = document.querySelector('#totalRuns');
    const inputMaxLevel = document.querySelector('#maxLevel');
    const rawRunCount = Number(inputTotalRuns.value);
    const rawMaxLevel = Number(inputMaxLevel.value);

    const output = document.querySelector('#output');
    const error = document.querySelector('#error');

    error.replaceChildren();

    const fields = { level: inputMaxLevel, runs: inputTotalRuns };


    const result = processInputs(rawRunCount, rawMaxLevel);

    if(!result.ok)
    {
      error.textContent = result.message;
      fields[result.field].focus();
      return;
    }

    for(let i = 1; i <= result.values.runCount; i++)
     {
       runs.push(simulate(jobs[selected], result.values.maxLevel));
     }



    const sheet = new StatSheet(runs);

    assertFormattersComplete(sheet.typeNames, formats)

    output.replaceChildren();
    sheet.typeNames.forEach(statistic => {

      const card = makeStatCard(sheet.statNames, sheet[statistic], statistic, getProperName(statistic), formats[statistic]);
      output.appendChild(card);
    })




}




function makeStatCard(statNames, statSheetType, id, label, format) {
  const cardStat = document.createElement('div');
  cardStat.id = id;
  const cardTitle = document.createElement('h2'); 
  cardTitle.textContent = label;
  cardStat.appendChild(cardTitle);
  statNames.forEach((stat) => { 
    const div = document.createElement("div");
    div.textContent = `${stat}: ${format(statSheetType[stat])}`;
    cardStat.appendChild(div);
  })

  cardStat.classList.add('card');

  return cardStat;
}


function assertFormattersComplete(typeNames, formats) {
    typeNames.forEach(statistic => {
        if(!Object.hasOwn(formats, statistic)) {
          throw new Error("No entry for " + statistic);
        }
        if(typeof formats[statistic] !== 'function') {
          console.log(typeof formats[statistic]);
          throw new Error(statistic + " is not a function");
        }

    })


}