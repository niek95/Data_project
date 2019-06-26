import csv

crimelevel = {
    "VIOLATION": "1",
    "MISDEMEANOR": "2",
    "FELONY": "3"
}
with open("NYPD_Complaint_Data_Historic.csv", "r") as source:
    reader = csv.reader(source)
    with open("NYPD_crimes.csv", "w", newline='') as result:
        writer = csv.writer(result)
        for r in reader:
            if (r[1][len(r[1])-4:] == "2014"):
                writer.writerow((r[1], r[2], r[7], crimelevel[r[11]], r[14]))
