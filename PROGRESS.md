# Week 1
### Day 1:
Had already decided to do a data visualization of crime in New York City. I had found a dataset for the years 2014 and 2015. Initially wanted to visualize crime in the 5 different boroughs, but later decided to further specify it by police precinct. Planning to make map, a timeline and a pie chart. Finished
initial proposal.

### Day 2:
Decided to look at misdemeanors and violations as well, instead of only at felonies. Due to the high number of different types of crimes it's better to do a calendar view to look at the amount of crime on different days of the year instead of a pie chart, which would become unreadable if too many types are shown. Started with design document. Decided to possibly add a week slider and possibly a week visualization

### Day 3:
Found a map of NYC precincts. Unfortunately it is in GEOjson and needs to be converted to Topojson. Set up github and html page. Found out data is also put into broader categories, making a pie chart possible again.

### Day 4:
Started with the csv conversion script. Tried to convert it into a logical json file. Also found out the api is publicly available. Might be interesting to use that instead of the massive csv file used currently. Using jQuery would be an idea.

### Day 5:
Start by further working out api idea. Site for requesting an api token is
offline unfortunately. Api request for 50.000 records, about the amount of
crimes in a year, takes almost 30 seconds. If you add all the processing this
will take way too long. Back to the local dataset. Added input sliders and date
input. Added bootstrap navbar, which seems to break the sliders for some reason

# Week 2
### Day 6/7:
Finished preprocessing scripts. Removes unnecessary columns, groups crimes by
precinct and sorts crimes by date and time. Data is output in json. This reduces
the file size to about 20MB. Keep getting topojson error.

### Day 8:
Fixed topojson error after a day and a half. The id of the precincts was lost in
the conversion, which had to be added in an additional python script.
Now it still won't render properly, probably due to the projection or conversion
from geojson. Can't figure it out.

### Day 9:
Found a working projection by trial and error. Centered the map on the proper
coordinates and zoomed in 50000 times.

### Day 10:
Need to find a way to efficiently search the dataset by day and hour, as this
needs to be done in realtime whenever a user changes the parameters. Need
to change the datastructure a bit for easier searching. Dataset now holds
seperate lists per precinct per month.

# Week 3
### Day 11:
Decided to add seperate lists for days as well. Something in the dataprocessing
seems to go wrong, as there are not enough crimes per day.

### Day 12
Stuck on giving colour to the map. Added name attribute to the topojson, but
that didn't work. Apparently datamaps needs an id to link data to the map. Need
to add this to the json file. Wrote a small python script to add it. Map finally
displays correct colours.

### Day 13
Added hour to json file and removed time and precinct entirely after processing
in order to get a smaller file size and faster displaying speed. This way all
information is encoded in the json file itself so it contains no more redundant
information. Now to find a way to loop through everything based on the chosen
time period.

### Day 14
Finally managed to finish the date selector. It's very messy at the moment, so
future optimizations might be able to make it run a bit faster. Also fixed
the day selector and attached it to the slider on the page.

### Day 15
After speaking with a few fellow students I decided that a date selector might
not even be necessary. It is not really relevant for seeing trends in data.
Seeing the difference between days in the week is more important.
Also the colours scale differently depending on the data selected. It might be
better to get an overall maximum so that differences between days and hours
become more clear. Finished the line graph view and started on the calendar.
Realized today that I haven't committed everyday, as I mostly work on one
laptop only. Also received feedback about the navbar, which I had put in in
the first week but would work better as a dropdown. Will focus this weekend on
getting the calendar working as soon as possible, in order to get going on the
styling and layout of the page.

### Weekend
Finished the calendar. Now to add titles, legends and fix small bugs,
inconsistencies and streamline code. Due to the fact that no more features
should be added, it might be worth it to eliminate the data about the specific
type of crime entirely, and to aggregate it into the main categories per hour.
This eliminates the final step in a lot of data loops so could speed up the
visualisation significantly.
Some functions have functionality that is very similar to other functions. Some
of them could be merged to improve space, code complexity and readability.
Used this link as guide for the calendar:
https://www.crowdanalytix.com/communityBlog/10-steps-to-create-calendar-view-heatmap-in-d3-js

### Day 16
Further small advancements, adding updateable titles, positioning, small code
improvements. Also discussed with another student on how to transition visualizations.
Was able to remove get_min_max function by modifying the data retriever.
Finished legend for datamap and added dynamic title based on data shown. TA
suggested using a drag slider in d3 instead of a html range input. Will also try
to use an update function when calendar or line graph are changing.
Reworked the json file again. Page load improves from ~2 seconds to

### Day 17
questions: Is it better to get scripts from cdn or local? How to divide containers
over page? How to transition datamap? Functions are very long at the moment, how
to improve that? Changed calendar legend to continuous one. Further small
improvements. Got stuck on updating the map. Found out by tracing the error that
it has to do with queryselectors having trouble with classes that start with a
number. Have to rename precincts with a letter in front of it. This needs to
be done in the topojson as well. Nigel suggested some of the get-functions can
be moved to another file

### Day 18
Got tired of the favicon error so added a small logo. Trying to find a nice
bootstrap template to present everything.
