import { jobs } from './data/classData.js'
import { StatSheet } from './statSheet.js'
import { simulate } from './simulator.js'
import { processInputs } from './parseRequest.js';
import { getProperName } from './formatting/getProperName.js'


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

    const cards = sheet.typeNames.map(statistic => makeStatCard(sheet.statNames, sheet[statistic], statistic, getProperName(statistic), formats[statistic]));

    const resultCard = makeResultCard( {  job: selected, level: result.values.maxLevel, runCount: result.values.runCount, version: "NES",  cards: cards })

    output.replaceChildren();
    output.append(resultCard);

    const status = document.querySelector('#status');
    status.textContent = getProperName(selected) + " results ready: " + result.values.runCount.toLocaleString() + " runs done, at Level " +  result.values.maxLevel;
}


function makeResultCard(options) {
  const masterResultCard = document.createElement('article'); 
  masterResultCard.classList.add('result-card');

  const resultHeader = document.createElement('header')
  const resultCardTitle = document.createElement('h2'); 
  resultCardTitle.textContent = getProperName(options.job) + " Results";
  resultHeader.append(resultCardTitle);


  const facts = {
    Version: options.version,
    Level: options.level,
    Runs: options.runCount.toLocaleString()
  };

  const descriptionList = document.createElement('dl');
  descriptionList.classList.add('header-descriptions');
  Object.entries(facts).forEach(([term, value]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');

      dt.textContent = term;
      dd.textContent = value;

      descriptionList.append(dt, dd);

  });

  resultHeader.append(descriptionList);

  const spriteImage = document.createElement('img');
  spriteImage.src = `images/classes/${options.job}.png`;
  spriteImage.alt = "";
  spriteImage.classList.add('class-sprite');

  resultHeader.append(spriteImage);

  masterResultCard.append(resultHeader);

  const innerGrid = document.createElement('div');
  innerGrid.classList.add('result-card-grid');

  innerGrid.append(...options.cards);
  masterResultCard.appendChild(innerGrid);
  return masterResultCard;
}




function makeStatCard(statNames, statSheetType, id, label, format) {
  const cardStat = document.createElement('div');
  cardStat.id = id;
  const cardTitle = document.createElement('h3'); 
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
          throw new Error(statistic + " is not a function");
        }

    })


}