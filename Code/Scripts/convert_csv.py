import csv
import json
import datetime as dt
from calendar import monthrange

precincts = {
}
crimes = []
with open("NYPD_crimes.csv", "r") as source:
    reader = csv.reader(source)
    for row in reader:
        date = dt.datetime.strptime(row[0], '%m/%d/%Y')
        time = dt.datetime.strptime(row[1], '%H:%M:%S').time()
        combined = dt.datetime.combine(date, time)
        crime = [combined, row[2], row[3], "p" + row[4]]
        if not crime[3] in precincts:
            precincts[crime[3]] = {
                "id": crime[3],
                "crimes": {}
            }
        crimes.append(crime)
sortedCrimes = sorted(crimes, key=lambda x: x[0])

precincts["all"] = {
    "id": "All precincts",
    "crimes": {}
}

for precinct in precincts:
    for i in range(1, 13):
        precincts[precinct]["crimes"][i] = {}
        for j in range(1, monthrange(2014, i)[1] + 1):
            precincts[precinct]["crimes"][i][j] = {}
            for k in range(24):
                precincts[precinct]["crimes"][i][j][k] = [0, 0, 0, 0]

for crime in sortedCrimes:
    month = crime[0].month
    day = crime[0].day
    hour = crime[0].hour
    precinct = crime[3]
    precincts[precinct]["crimes"][month][day][hour][int(crime[2])] += 1

for precinct in precincts:
    for i in range(1, 13):
        for j in range(1, monthrange(2014, i)[1] + 1):
            precincts[precinct]["crimes"][i][j]["day-totals"] = [0, 0, 0, 0]
            for k in range(24):
                violations = precincts[precinct]["crimes"][i][j][k][1]
                misdemeanors = precincts[precinct]["crimes"][i][j][k][2]
                felonies = precincts[precinct]["crimes"][i][j][k][3]
                precincts[precinct]["crimes"][i][j][k][0] += \
                    violations + misdemeanors + felonies

                hour_total = precincts[precinct]["crimes"][i][j][k]
                precincts[precinct]["crimes"][i][j]["day-totals"] =\
                    [x + y for x, y in
                        zip(precincts[precinct]["crimes"][i][j]["day-totals"],
                            hour_total)]

                precincts["all"]["crimes"][i][j][k] =\
                    [x + y for x, y in
                        zip(precincts["all"]["crimes"][i][j][k],
                            hour_total)]

                precincts["all"]["crimes"][i][j]["day-totals"] =\
                    [x + y for x, y in
                        zip(precincts[precinct]["crimes"][i][j]["day-totals"],
                            hour_total)]

with open("NYPD_crimes_new.json", "w") as destination:
    json.dump(precincts, destination)
