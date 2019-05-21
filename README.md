Differences in major crime statistics between the five boroughs of New York City
=======
Niek Slemmmer 12639184
Final project of the programming minor. For this project I will attempt to visualize the amount and ocurrence times of felonies in the five boroughs of New York City. [Data source](https://www.kaggle.com/adamschroeder/crimes-new-york-city)
## Problem statement:
Police budgets are never big enough to handle all cases being reported. To make sure the available budget is being spent as efficiently as possible it is useful to know when and where certain types of crimes are committed. This way, police departments can allocate resources where they are needed. As the amount of crimes is very high for a city as big as, an interactive visualization can help police departments in seeing where, and when capacity is needed the most.

## Solution:
An interactive visualization of the amount and type of felonies commited in New York City, splittable by borough and time.

**Example images:**
For the first visualization, a map will be shown like so:
![alt text](https://media2.govtech.com/images/940*443/NYC_CrimeMap.jpg "NYC crime map")

The pie chart:
![alt text](https://webarchive.nationalarchives.gov.uk/20081023090926im_/http://www.crimereduction.homeoffice.gov.uk/graphics/victims34.gif "Crimes split by type")

Number of crimes by the hour:
![alt text](https://minimaxir.com/img/sf-arrest-map/ssi-crime-1.png "Crimes by time of day")


**Features (mvp):**
* A map of New York City, the colour of each borough corresponding to the total amount of felonies committed
* When a borough is clicked, a pie chart containing the distribution of the types of felonies appears
* A 24h timeline, with a line chart for the number of crimes committed in each hour

**Features (optional):**
* Be able to select data from different years or time periods
* Be able to select the type of felony in the map
* Be able to select the type of felony in the timeline
* Be able to differentiate per borough in the timeline

**Prerequisites:**
Data set to be used: [https://www.kaggle.com/adamschroeder/crimes-new-york-city](https://www.kaggle.com/adamschroeder/crimes-new-york-city)
Depending on the implementation of multiple years, the original dataset from New York City itself can also be used: [https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i](https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i)

The city of New York already offers an extensive visualization tool for this dataset, where most of the variables can be plotted against each other. Both a map and a timeline could be useful additions to these visualizations.
