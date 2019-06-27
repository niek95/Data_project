# Final Report
Data project Minor Programmeren  
Niek Slemmer  
12639184  
June 2019
### About
This project contains a visualization of different categories of crimes
committed in New York City in 2014. Users can view data by the day of the week
or by time of day, as well as totals for the entire year. Data is categorised
by police precinct and can be viewed on a heatmap of the city.

<img src="/Docs/screenshot4.PNG" alt="screenshot of input" width="500"/>  

### Components
##### Data structure
The final data structure is found in the "NYPD_crimes_new.json" file. It represents all crimes committed in New York City in 2014, aggregated by severity.

##### Input
The input part of the page consists of a dropdown menu to select crime level, a button to revert to showing all precincts, and two sliders to select the day and time.

##### Heatmap
The heatmap shows the police precincts of New York City, and colours them in based on the amount of crimes committed in the selected time periods.

##### Line chart
The line chart shows, for the selected crime type and precinct, the total amount of crime committed in each hour of the day.

##### Calendar
The calendar shows a heatmap, for the selected crime type and precinct, of the total amount of crimes committed on each day of the year.

### Technical design
##### Data structure
In the first few days retrieving data from the government api was considered. However after finding out that a single request would take around 30 seconds this idea was abandoned.  

To convert the 250mb csv file into a workable json, a lot of data had to be cut. Using python, all unnecessary columns were deleted from the file, before converting it to a json file. The final json structure has been amended a number of times before settling on the final design. During the project I realised that the more processing could be done beforehand, the faster the page would load. This took a lot of time to realize however, and has slowed the process in the beginning significantly.

The final structure consists of a number of nested key-value structures, starting with the precinct id, which refers to an object containing a list of crimes. In this list a month key refers to a list of days.  
In the same way, this date acts as key to yet another list of keys, referring to the hour in which crimes are committed. Each hour refers to an array with four values. This array contains the total amount of crimes, the amount of violations, misdemeanors, and felonies, respectively.

The "Data" folder also contains a Topojson map of the precincts of New York City. This map is converted from a GEOjson file.

##### Input
Both the dropdown and the button are implemented using standard Bootstrap.
The dropdown has an onchange event listener to execute the update functions.
The button executes these when clicked.
At first I had a range slider for both the day and the hour, but because no
browsers currently support labels for some reason, I decided to use the d3-based
simple-slider plugin. It uses D3 functions to implement different types of
sliders. An advantage of this implementation was that is updates the map for
each tick crossed, which results in the map updating live when the slider
slides across the bar.

##### Heatmap
The heatmap of the city is implemented using Datamaps. It uses D#-ja to link a dataset to a topojson map. In the beginning I had some trouble in finding the right coordinates and zoom level, as well as some trouble due to the conversion from GEOjson. Datamaps needs an id in the object to link its data to, but that was lost in conversion. Used python to add it again.

An update function was added to make the colours and data transition smoothly when necessary. This function also updates the title and legend.

Later I had to amend the name of the precinct again, in order to properly transition the colour. This had to do with the fact that queryselectors can't handle names starting with a number, so a letter had to be added in front of each name.

For the legend a D3 rectangle is added, and filled in with a gradient matching the one used in the map. A gradient is used because the data is continuous. The maximum number is the extracted from the data and rendered under the legend with a few steps in between.

##### Line chart
The line chart is implemented using D3, using mostly standard functions. I had, and still have some trouble with resizing the chart to make it responsive. It uses the "Viewbox" function to scale the svg based on the size of the window.

An update function is added to transition the axes and data using the d3 transition function and to amend the title.

##### Calendar
The calendar uses D3 as well to implement its functions. It draws a rectangle on the svg for each day in the year. The position is determined by getting the day of the week and week number from the javascript date object. Rectangles are the filled in based on the colour scale used in the page, which scales data to the maximum amount of crimes on a single day in any precinct. This is done to be able to better compare precincts between each other.

The legend uses the same code as the one in the datamap. At first colour categories were considered, but as the data is continuous, a gradient was deemed a better option.

##### Data retrieval
To keep the main file clean all data retrieval classes have been moved to a separate helpers file. These functions loop through the json file, and return data in the necessary structure, according to the arguments.

##### Page design
I kept the page design relatively simple, as there is not a lot to be shown.
Navbar is implemented using Bootstrap, and the page elements all fit into a
container, with the visualizations using a standard row-column structure.

### Further development
Looking back, I think the final page is a helpful tool for presenting the chosen data. The three visualizations enable a user to quickly get an high-level overview of the situation in the city with regards to criminal activity. With more time however, a further breakdown of the crime categories could be useful. Where and when do violent crimes happen for instance, or at which times does the most theft occur. The heatmap could also be worked out further by showing where exactly crimes take place. That way police have an even more detailed perspective on criminal activity.

### Challenges
##### Determining the final data structure
A lot of time went into determining the final data structure. Even in the last week it was amended to speed up rendering and to improve readability. Most of this was because it required a certain amount of trial and error to determine what worked and what didn't. I also decided later in the project to abandon the idea of
showing a pie chart. This enabled the aggregating of the data by severity and
made the final data structure a lot simpler, because it didn't have to hold
a record for every single crime.

##### Responsive design
In the final week I decided to try and make the page responsive. Although I
mostly succeeded, and the page resizes mostly correctly when rendered and then
resized. It did lead to some trouble with regard to the deadline. It ultimately
took a lot more time then I realized beforehand, which could have been used for
the implementation of a bootstrap template, or other page design elements. It
did mostly work out however, and I am happy with the page behaviour when resizing.

##### Next projects
For next projects it could be helpful to do even more planning beforehand,
especially with regards to the data structure, as this is the most important
element in a data visualization project. It did help a lot to already have a
formalized design document beforehand.
