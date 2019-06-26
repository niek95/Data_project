import json

with open("precincts.json", "r") as file:
    data = json.load(file)
    for precinct in data["objects"]["Police Precincts"]["geometries"]:
        precinct["properties"]["precinct"] = \
            "p" + precinct["properties"]["precinct"]
        precinct["id"] = precinct["properties"]["precinct"]
with open("precincts.json", "w") as result:
    json.dump(data, result)
