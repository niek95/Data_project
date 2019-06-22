window.onload = function() {
  main();
};

var main = async () => {
  let json_data = await d3v5.json("Data/NYPD_crimes.json");
  //console.log(json_data);
  let day_select = document.getElementById("dayselect");
  build_map(json_data, day_select.value);
  build_calendar(json_data, 78, 0)
  day_select.onchange = () => {
    build_map(json_data, day_select.value);
  };
//  let start = new Date(2014, 1, 1, 0);
//  let end = new Date(2014, 11, 31, 23);
//  build_map(select_day(json_data, 6));
};

var build_map = (json_data, day) => {
  crime_data = select_day(json_data, day, 0);
  var colour_data = {};
  d3v5.select("svg").remove();
  let min_max = get_min_max(crime_data);
  let palette_scale = d3.scale.linear()
            .domain([min_max[0], min_max[1]])
            .range(["#FFFFFF","#A50F15"]);
  crime_data.forEach(item => {
        let iso = item[0], value = item[1];
        colour_data[iso] = {numberOfThings: value, fillColor: palette_scale(value)};
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
   },
   done: datamap => {
     datamap.svg.selectAll('.datamaps-subunit').on('click', geography => {
       build_calendar(json_data, geography.properties.precinct, 0);
       build_line_graph(json_data, geography.properties.precinct, 0);
     });
   }
  });
};

var build_calendar = (json_data, precinct, crime_level) => {

  d3v5.select(".calendar").remove();
  let cell_size = 15;
  let cal_height = 150;
  let cal_width = 900;
  let margin = 50;
  let calendar_data = get_calendar_data(json_data, precinct, crime_level);

  let day = d3v5.timeFormat("%w");
  let week = d3v5.timeFormat("%U");
	let format = d3v5.timeFormat("%Y%m%d");
  let week_days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let min_max = get_min_max_calendar(calendar_data);
  console.log(min_max)
  let colour_scale = d3.scale.linear()
            .domain([min_max[0], min_max[1]])
            .range(["#FFFFFF","#A50F15"]);

  let svg = d3v5.select("body")
    .append("svg")
    .attr("width", cal_width)
    .attr("height", cal_height)
    .attr("class", "calendar")
    .append("g")
      .attr("transform", "translate(" + ((cal_width - cell_size * 53) / 2) +
      "," + (cal_height - cell_size * 7) + ")");

  for (let i = 0; i < 7; i++) {
  svg.append("text")
    .attr("transform", "translate(-5," + cell_size * (i + 1) + ")")
    .style("text-anchor", "end")
    .attr("dy", "-.25em")
    .text((d) => { return week_days[i]; });
     }

  var rect = svg.selectAll(".day")
   .data((d) => {
     return d3.time.days(new Date(2014, 0, 1), new Date(2015, 0, 1));
   })
   .enter()
	   .append("rect")
   .attr("class", "day")
   .attr("width", cell_size)
   .attr("height", cell_size)
   .attr("x", (d) => { return week(d) * cell_size + 1; })
   .attr("y", (d) => { return day(d) * cell_size + 1; });


  rect.filter((d) => {
    return d in calendar_data;
  })
    .attr("fill", (d) => { return colour_scale(calendar_data[d]); });
};


var build_line_graph = (json_data, precinct, crime_level) => {
  d3v5.select(".line-chart").remove();
  hour_data = get_hour_data(json_data, precinct, crime_level);
  let max_value = 0;
  for (let i = 0; i < hour_data.length; i++) {
    max_value = Math.max(max_value, hour_data[i].crimes);
  }
  let margin = 50;
  let width = 500;
  let height = 500;
  let data_points = 24;

  let xScale = d3v5.scaleLinear()
    .domain([0, data_points - 1])
    .range([margin, width - margin]);

  let yScale = d3v5.scaleLinear()
    .domain([0, Math.max(...hour_data)])
    .range([height - margin, margin]);

  let line = d3v5.line()
    .x((d, i) => {
      return xScale(i);
    })
    .y((d) => {
      return yScale(d);
    });

    let svg = d3v5.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "line-chart")
      .append("g");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - margin) + ")")
      .call(d3v5.axisBottom(xScale));

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ margin + ", 0)")
      .call(d3v5.axisLeft(yScale));

    svg.append("path")
      .datum(hour_data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "black");
};

var get_hour_data = (json_data, precinct, crime_level) => {
  let hour_data = new Array(24).fill(0);
  for (let month in json_data[precinct].crimes) {
    for (let day in json_data[precinct].crimes[month]) {
      for (let hour in json_data[precinct].crimes[month][day]) {
        for (let crime in json_data[precinct].crimes[month][day][hour]) {
          if (crime_level == 0 || json_data[precinct].crimes[month][day][hour][crime][1] == crime_level) {
            hour_data[hour]++;
          }
        }
      }
    }
  }
  return hour_data;
};

var get_calendar_data = (json_data, precinct, crime_level) => {
  let calendar_data = {};
  for (let month in json_data[precinct].crimes) {
    for (let day in json_data[precinct].crimes[month]) {
      // Initialize array for counting crimes by level, with totals[0] for all levels combined
      totals = [0, 0, 0, 0];
      for (var hour in json_data[precinct].crimes[month][day]) {
        for (let crime in json_data[precinct].crimes[month][day][hour])
        totals[json_data[precinct].crimes[month][day][hour][crime][1]]++;
      }
      totals[0] = totals[1] + totals[2] + totals[3];
      calendar_data[new Date(2014, month - 1, day)] = totals[crime_level];
    }
  }
  console.log(calendar_data);
  return calendar_data;
};

var select_day = (json_data, day_of_week, crime_level) => {
  dataset = [];
  for (let precinct in json_data) {
    // Initialize array for counting crimes by level, with totals[0] for all levels combined
    totals = [0, 0, 0, 0];
    for (let month in json_data[precinct].crimes) {
      for (let day in json_data[precinct].crimes[month]) {
        let current_day = new Date(2014, month, day).getDay();
        if (day == 7 || current_day == day_of_week) {
          for (var hour in json_data[precinct].crimes[month][day]) {
            for (let crime in json_data[precinct].crimes[month][day][hour]) {
              totals[json_data[precinct].crimes[month][day][hour][crime][1]]++;
            }
          }
        }
      }
    }
    totals[0] = totals[1] + totals[2] + totals[3];
    dataset.push([precinct, totals[crime_level]]);
  }
  return dataset;
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

var get_min_max_calendar = (dataset) => {
  let curr_min = Number.MAX_SAFE_INTEGER;
  let curr_max = 0;
  for (var key in dataset) {
    curr_min = Math.min(curr_min, dataset[key]);
    curr_max = Math.max(curr_max, dataset[key]);
  }
  return [curr_min, curr_max];
};

var select_data = (json_data, range) => {
  dataset = [];
  for (let precinct in json_data) {
    // Initialize array to track the number of violations, misdemeanors and felonies, respectively
    crimes = [0, 0, 0];
    for (let i = range[0].getMonth() + 1; i <= range[1].getMonth() + 1; i++) {
      let start_day = 1;
      let stop_day = 31;
      if (range[0].getMonth() == range[1].getMonth()) {
        stop_day = range[1].getDate();
      }
      if (i == range[0].getMonth() + 1) {
        start_day = range[0].getDay();
      }
      for (let j = start_day; j <= stop_day; j++) {
        let start_hour = 0;
        let stop_hour = 23;
        if (range[0].getDate() == range[1].getDate()) {
          stop_hour = range[1].getHours();
        }
        if (j == range[0].getDate()) {
          start_hour = range[0].getHours();
        }
        for (let k = start_hour; k <= stop_hour; k++) {
          for (let l in json_data[precinct].crimes[i][j][k]) {
            crimes[json_data[precinct].crimes[i][j][k][l][1] - 1]++;
          }
        }
      }
    }
    total = crimes[0] + crimes [1] + crimes[2];
    dataset.push([precinct, total]);
  }
  return dataset;
};
