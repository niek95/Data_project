Differences in major crime statistics between police precincts of New York City
=======
Niek Slemmer 12639184
Final project of the programming minor. For this project I will attempt to visualize the amount and
occurrence times of crimes for each police precinct of New York City.
[Data source](https://www.kaggle.com/adamschroeder/crimes-new-york-city)
## Problem statement:
Police budgets are never big enough to handle all cases being reported.
To make sure the available budget is being spent as efficiently as possible it
is useful to know when and where certain types of crimes are committed. T
his way, police departments can allocate resources where they are needed.
As the amount of crimes is very high for a city as big as New York,
an interactive visualization can help police departments in seeing where,
and when capacity is needed the most.

## Solution:
An interactive map of the amount and type of crimes committed in New York City.

**Example images:**
For the first visualization, a map will be shown like so:
![alt text](https://media2.govtech.com/images/940*443/NYC_CrimeMap.jpg "NYC crime map")

The calendar view:
![alt text](https://sites.google.com/site/e90e50charts/_/rsrc/1371221453897/home/Calendar_view.png "Crimes committed per day")

Number of crimes by the hour:
![alt text](https://minimaxir.com/img/sf-arrest-map/ssi-crime-1.png "Crimes by time of day")


**Features (mvp):**
* A map of New York City, with the colour of each precinct corresponding to the total amount of crimes committed
* When a precinct is clicked, calendar view will appear with the amount of crimes committed per day
* A 24h timeline, with a line chart for the average number of crimes committed in each hour
in that year in the given precinct, split by category (violation, misdemeanor or felony)

**Features (optional):**
* Be able to select the type of crime in the map
* Be able to select the type of crime in the calendar view
* Be able to split the data into smaller categories
* Be able to select data from different years or time periods

**Prerequisites:**
Data set to be used: [https://www.kaggle.com/adamschroeder/crimes-new-york-city](https://www.kaggle.com/adamschroeder/crimes-new-york-city)
Depending on the implementation of multiple years, the original dataset from New York City itself can also be used: [https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i](https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i)

* The d3.js library will be used extensively, as it contains a lot of useful tools for
data visualization.
* Datamap.js will be used for the initial visualization, the map of New York City
* Topojson will be used for the datamap

The city of New York already offers an extensive visualization tool for this dataset,
where most of the variables can be plotted against each other.
Both a map and a timeline could be useful additions to these visualizations.

The hardest part will probably be transforming the dataset into a usable format.
It contains more than 6.5 million datapoints.
