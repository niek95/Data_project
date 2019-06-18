window.onload = function() {
  main();
};

var main = async () => {
  let json_data = await d3v5.json("Data/NYPD_crimes.json");
  console.log(json_data);
  build_map(select_data(json_data));
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
  colour_data["undefined"] = {numberOfThings: 0, fillColor: "#3e29db"};
  console.log(colour_data);
  var map = new Datamap({
    element: document.getElementById("container"),
    data: colour_data,
    geographyConfig: {
      dataUrl: "/Data/precincts.json",
      popupTemplate: (geography, data) => {
        return geography.properties.name;
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

var select_data = (json_data) => {
  dataset = [];
  for (let precinct in json_data) {
    let totals = 0;
    for (let month in json_data[precinct].crimes) {
      for (let day in json_data[precinct].crimes[month]) {
        totals += json_data[precinct].crimes[month][day].length;
      }
    }
    dataset.push([json_data[precinct].id, totals]);
  }
  return dataset;
};
