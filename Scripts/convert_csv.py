import csv
import json
import datetime as dt

precincts = {
}
crimes = []
with open("NYPD_crimes.csv", "r") as source:
    reader = csv.reader(source)
    for row in reader:
        date = dt.datetime.strptime(row[0], '%m/%d/%Y')
        time = dt.datetime.strptime(row[1], '%H:%M:%S').time()
        combined = dt.datetime.combine(date, time)
        crime = [combined, row[2], row[3], row[4]]
        if not crime[3] in precincts:
            precincts[crime[3]] = {
                "id": crime[3],
                "crimes": {}
            }
        crimes.append(crime)
sortedCrimes = sorted(crimes, key=lambda x: x[0])
print(len(sortedCrimes))
for crime in sortedCrimes:
    month = crime[0].month
    day = crime[0].day
    if month in precincts[crime[3]]["crimes"]:
        if day in precincts[crime[3]]["crimes"][month]:
            precincts[crime[3]]["crimes"][month][day].append(crime)
        else:
            precincts[crime[3]]["crimes"][month][day] = [crime]
    else:
        precincts[crime[3]]["crimes"][month] = {}
        precincts[crime[3]]["crimes"][month][day] = [crime]

for id, precinct in precincts.items():
    for month, days in precinct["crimes"].items():
        for day, crimes in days.items():
            for crime in crimes:
                crime[0] = str(crime[0])
with open("NYPD_crimes.json", "w") as destination:
    json.dump(precincts, destination)
