window.onload = function() {
  main();
};

var main = async () => {
  let json_data = await d3v5.json("Data/NYPD_crimes.json");
  console.log(json_data);
  let start = new Date(2014, 0, 0, 0);
  let end = new Date(2014, 11, 31, 23);
  build_map(select_data(json_data, [start, end]));
};

var build_map = (crime_data) => {
  var colour_data = {};
  d3v5.select("svg").remove();
  let min_max = get_min_max(crime_data);
  let paletteScale = d3.scale.linear()
            .domain([min_max[0], min_max[1]])
            .range(["#FFFFFF","#A50F15"]);
  crime_data.forEach(item => {
        let iso = item[0], value = item[1];
        colour_data[iso] = {numberOfThings: value, fillColor: paletteScale(value)};
    });
  console.log(colour_data);
  var map = new Datamap({
    element: document.getElementById("container"),
    data: colour_data,
    geographyConfig: {
      dataUrl: "/Data/precincts.json",
      popupTemplate: (geography, data) => {
        return geography.properties.precinct;
      }
    },
    scope: 'Police Precincts',
    setProjection: (element, options) => {
      var projection, path;
      projection = d3.geo.equirectangular()
          .center([-73.75, 40.730610])
          .scale(50000);
      path = d3.geo.path()
        .projection(projection);
      return {path: path, projection: projection};
   }
  });
};

var get_min_max = (dataset) => {
  let curr_min = Number.MAX_SAFE_INTEGER;
  let curr_max = 0;
  for (let i = 0; i < dataset.length; i++) {
    curr_min = Math.min(curr_min, dataset[i][1]);
    curr_max = Math.max(curr_max, dataset[i][1]);
  }
  return [curr_min, curr_max];
};

var select_data = (json_data, range) => {
  dataset = [];
  for (let precinct in json_data) {
    console.log(precinct)
    // Initialize array to track the number of violations, misdemeanors and felonies, respectively
    crimes = [0, 0, 0];
    for (let i = range[0].getMonth(); i <= range[1].getMonth(); i++) {
      let stop_day = json_data[precinct].crimes[i].length;
      if (range[0].getDate() == range[1].getDate()) {
        stop_day = range[1].getDate();
      }
      for (let j = range[0].getDate(); j <= stop_day; j++) {
        let stop_hour = 23;
        if (range[0].getHours() == range[1].getHours()) {
          stop_hour = range[1].getHours();
        }
        for (let k = range[0].getHours(); k <= stop_hour; k++) {
          for (let l in json_data[precinct].crimes[i][j][k]) {
            crimes[json_data[precinct].crimes[i][j][k][1] - 1]++;
          }
        }
      }
    }
    total = crimes[0] + crimes [1] + crimes[2];
    dataset.push([precinct, total]);
  }
  return dataset;
};
