Design document
=======
### Data sources
For this project I will be using the following data source: ![Kaggle link](https://www.kaggle.com/adamschroeder/crimes-new-york-city/downloads/crimes-new-york-city.zip/1). Depending on the implementation of selection by year the
original sources from the NYPD can also be used: ![Original source](https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i)

### Technical components
**Preprocessing and aggregation**
Firstly, the dataset that is going to be used is massive, and contains about
6.5 million datapoints. To make sure the visualizations are runnable and to
prevent losing the big picture the data will have to be aggregated into a more
usable format. Firstly we delete all columns we don't need.
As we are interested in the differences between police precincts
the data will be split into three categories: violations, misdemeanors and
felonies. Each precinct will be converted to an object, containing
the amount of each category of crime, sorted by day or hour. This way the file size
can be reduced by a significant amount.

Python will be used for both these steps. After this program is run the original
file can be deleted.
#### Data representation
Instead of individual rows of single crimes the data will be aggregated by
precinct. Each precinct will have its own object. Containing a calendar and week
attribute. The calendar attribute will have a seperate calendar for each year,
and each day of the week will be divided into hours. A count will be attached
to each attribute for each of the categories.

**Visualization**
The visualization will consist of three parts:
* A map of New York. Each precinct will have a colour corresponding with the
total amount of crimes committed for a given day, or hour. A slider can
be used to pick a specific day of the week and time to view the map, and
possibly a date selector to pick a specific date. A dropdown menu might be added
to select the type of crime (violation, misdemeanor or felony)
* A timeline. When a precinct is clicked a line chart representing a 24h time
period appears under the map. A line for each of the crime categories will show
the amount of crimes committed in at each hour of the day.
* A calendar view. Besides the timeline, a calendar view will appear below the
map. Each day will have a colour corresponding with the amount of crimes committed
that day
* (Extra) A week view
* (Extra) Pie chart with categories

**Requirements**
* Datamap of NYC precincts
* d3.js library
* Datamap.js
* Topojson
* Possibly bootstrap for presentation
