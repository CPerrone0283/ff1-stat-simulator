# Final Fantasy Simulator 

An application that attempts to determine what stats would be for each class given a certain amount of runs. Stats tend to vary from playthrough to playthrough, and this is an attempt to get some answers as to what these stats would look like over the course of many playthroughs. 

# HOW TO RUN THE PROJECT 

- You cannot run the simulator by simply clicking index.html. You must run a server.  
- To run the project, simply type `npm start` in a terminal and run the server. Open the url.  

# HOW TO USE THE SIMULATOR

- Select Runs and Level. The form enforces limits and tells you what they are. 
- Select Class: Select the class you want to see the stats of. 
- Click Simulate. This will run the simulate and compute the following stats: STR, AGI, VIT, INT, LCK, HP

# ABOUT THE SIMULATOR

- Each job has its own preset stats and will always gain specific stats at specific levels. 
- Each line found represents a level up. Each character found in the line is which stat will go up. (S for STR, A for AGI, etc). The stat gain will always be 1 point. 
- HP will always go up FLOOR(VIT/4) + 1. If there exists a + on the line, then HP goes up an additional 20-25 on top of this. The exact amount is random. 
- If a level up does not indicate a stat gain of a specific type, then that stat has a 25% chance of going up. Otherwise, no stat gain for that particular stat. 
- Stats are true to their calculations, not to their version. A Fighter and Black Belt can reach HP greater than 999, which is the cap for the NES version. 

# ADDITIONAL PROJECT INFORMATION

- Each job has its own preset stats. This is found in txt files found in the classes folder. The actual data used comes from '/data/classData.js'
- classData.js was created via node. To rerun, type in `npm run build` in a terminal.  
- app.js is the browser entry point. 
- parseRequest.js is what sets the boundaries for the number of runs and the max level. parseRequest.test.js is a unit test that tests this validation. 
- To run the unit tests for this simulator, on a terminal, run `npm test`. These unit tests currently sit next to their respective js files. 

# FUTURE VERSIONS 

Future versions will contain more info and data, and this readme will change based on what sits in the project currently. 