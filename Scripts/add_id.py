import json

with open("Police Precincts.json", "r") as file:
    data = json.load(file)
    for precinct in data["objects"]["Police Precincts"]["geometries"]:
        precinct["id"] = precinct["properties"]["precinct"]
with open("precincts.json", "w") as result:
    json.dump(data, result)
