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
Fixed topojson error after a day and a half. Now it still won't render properly,
probably due to the projection or conversion from geojson. Can't figure it out.

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
