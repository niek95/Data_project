window.onload = function() {
  main();
};

var main = async () => {
  let json_data = await d3v5.json("Data/NYPD_crimes.json");
  //console.log(json_data);
  crime_select = document.getElementById("crimeselect");
  day_select = document.getElementById("dayselect");
  hour_select = document.getElementById("hourselect");
  // add dummy precinct to json, to show calendar and line chart of all precicnts
  selected_precinct = "all";
  build_map(json_data, select_day(json_data, hour_select.value, day_select.value, crime_select.value));
  crime_select.onchange = () => {
    build_map(json_data, select_day(json_data, hour_select.value, day_select.value, crime_select.value));
    update_line_graph(json_data, selected_precinct, crime_select.value);
  };
  day_select.onchange = () => {
    hour_select.value = "24";
    build_map(json_data, select_day(json_data, hour_select.value, day_select.value, crime_select.value));
  };
  hour_select.onchange = () => {
    day_select.value = "7";
    build_map(json_data, select_day(json_data, hour_select.value, day_select.value, crime_select.value));
  };

//  let start = new Date(2014, 1, 1, 0);
//  let end = new Date(2014, 11, 31, 23);
//  build_map(select_day(json_data, 6));
};

var build_map = (json_data, crime_data) => {
  let map_width = document.getElementById("mapcontainer").clientWidth;
  let map_height = document.getElementById("mapcontainer").clientHeight;
  d3v5.select("svg").remove();
  let start_colour = "#FFFFFF";
  let stop_colour = "#A50F15";
  var colour_data = {};
  let palette_scale = d3.scale.linear()
            .domain([0, crime_data[1]])
            .range([start_colour, stop_colour]);
  crime_data[0].forEach(item => {
        let iso = item[0], value = item[1];
        colour_data[iso] = {numberOfThings: value, fillColor: palette_scale(value)};
    });

  var map = new Datamap({
    element: document.getElementById("mapcontainer"),
    data: colour_data,
    geographyConfig: {
      dataUrl: "/Data/precincts.json",
      popupTemplate: function(geo, data) {
        return ['<div class="hoverinfo"><strong>',
                "Precinct: " +
                geo.properties.precinct,
                ': ' + data.numberOfThings,
                '</strong></div>'].join('');
      }
    },
    scope: 'Police Precincts',
    setProjection: (element, options) => {
      var projection, path;
      projection = d3.geo.equirectangular()
          .center([-73.70, 40.730610])
          .scale(50000);
      path = d3.geo.path()
        .projection(projection);
      return {path: path, projection: projection};
   },
   done: datamap => {
     datamap.svg.selectAll('.datamaps-subunit').on('click', geography => {
       selected_precinct = geography.properties.precinct;
       if (document.getElementsByClassName("calendar").length == 0) {
         build_calendar(json_data, geography.properties.precinct, crime_select.value);
       } else {
         update_calendar(json_data, geography.properties.precinct, crime_select.value);
       }
       if (document.getElementsByClassName("line-chart").length == 0) {
         build_line_graph(json_data, geography.properties.precinct, crime_select.value);
       } else {
         update_line_graph(json_data, geography.properties.precinct, crime_select.value);
       }
     });
   }
  });

  let title = () => {
    if (day_select.value == 7) {
      if (hour_select.value == 24) {
        let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
        return crimes[crime_select.value] + " in 2014";
      } else {
        let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
        return crimes[crime_select.value] + " between " + hour_select.value + "-" + (parseInt(hour_select.value) + 1) + " o'clock in 2014";
      }
    } else {
      let days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
      let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
      return crimes[crime_select.value] + " on " + days[day_select.value] + " in 2014";
    }
  };

  d3v5.select(".datamap")
    .append("g")
    .append("text")
    .attr("class", "map-title")
    .attr("x", map_width / 2)
    .attr("y", 30)
    .text(title)
    .attr("text-anchor", "middle")
    .attr("font-size", 18);

  let svg = d3v5.select(".datamap").append("g").attr("class", "map-legend");

  let defs = svg.append("defs");

  let linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");

  linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

  linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", start_colour);

  linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", stop_colour);

  let legend_width = map_width / 3;
  let legend_height = 20;
  let legend_values = [0, 0.2, 0.4, 0.6, 0.8, 1];
  let legend_x = legend_width;
  let legend_y = map_height - 40;
  legend_values = legend_values.map((x) => { return Math.floor(crime_data[1] * x); });

  svg.append("rect")
      .attr("width", legend_width)
      .attr("height", legend_height)
      .style("fill", "url(#linear-gradient)")
      .attr("x", legend_width)
      .attr("y", legend_y)
      .attr("stroke", "black")
      .attr("stroke-width", 1);

  svg.selectAll(".legend-values").data(legend_values)
    .enter()
    .append("text")
    .attr("class", "legend-values")
    .attr("x", (d, i) => {
      return legend_x + i * (legend_width / (legend_values.length - 1));
    })
    .attr("y", legend_y + legend_height + 10)
    .text((d) => { return d; })
    .attr("text-anchor", "middle")
    .attr("font-size", 10);
};

var build_calendar = (json_data, precinct, crime_level) => {
  let cal_width = 700;
  let margin = 50;
  let month_margin = 3;
  let cell_size = (cal_width - 2 * margin - 12 * month_margin) / 53;
  let cal_height = 2 * margin + 7 * cell_size;
  let calendar_data = get_calendar_data(json_data, precinct, crime_level);

  let day = d3v5.timeFormat("%w");
  let week = d3v5.timeFormat("%U");
  let month = d3v5.timeFormat("%m");
	let format = d3v5.timeFormat("%Y%m%d");
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let max_crimes = get_max_day(json_data, crime_level);
  let colour_scale = d3.scale.linear()
            .domain([0, max_crimes])
            .range(["#FFFFFF","#A50F15"]);

  let svg = d3v5.select("#calcontainer")
    .append("svg")
    .attr("width", cal_width)
    .attr("height", cal_height)
    .attr("class", "calendar")
    .append("g");

let week_days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  svg.selectAll(".day-labels")
    .data(week_days)
    .enter()
    .append("text")
    .attr("class", "day-labels")
    .attr("x", margin / 2)
    .attr("y", (d, i) => {
      return margin + cell_size * (i + 1);
    })
    .text((d) => {
      return d; });

  let rect = svg.selectAll(".day")
   .data((d) => {
     return d3.time.days(new Date(2014, 0, 1), new Date(2015, 0, 1));
   })
   .enter()
	 .append("rect")
   .attr("class", "day")
   .attr("width", cell_size)
   .attr("height", cell_size)
   .attr("rx", cell_size / 5).attr("ry", cell_size / 5)
   .attr("x", (d) => { return margin + week(d) * cell_size + month(d) * month_margin; })
   .attr("y", (d) => { return margin +  day(d) * cell_size; })
   .attr("stroke", "black")
   .attr("stroke-width", 1);


  rect.filter((d) => {
    return d in calendar_data;
  })
    .attr("fill", (d) => { return colour_scale(calendar_data[d]); });

  let month_titles = svg.selectAll(".month-label")
    .data(months)
    .enter()
    .append("g");

  month_titles.append("text")
    .attr("class", "month-label")
    .attr("x", (d, i) => {
      return margin + i * (cal_width - 2 * margin) / 12;
    })
    .attr("y", 4 * margin / 5)
    .attr("text-anchor", "start")
    .text((d,i) => { return months[i]; });

  d3v5.select(".calendar")
    .append("text")
    .attr("class", "cal-title")
    .attr("transform", "translate(" + cal_width / 2 + "," + margin / 2 + ")")
    .attr("text-anchor", "middle")
    .text((d) => {
      let title = ["Total crimes", "Violations", "Misdemeanors", "Felonies"];
      return title[crime_level] + " per day in 2014: Precinct " + precinct;
    });

  let legend_array = [0, 0.25, 0.5, 0.75, 1];
  legend_array = legend_array.map((x) => { return max_crimes * x; });

  let legend = svg.selectAll(".cal-legend")
    .append("g")
    .attr("class", "cal-legend")
    .data(legend_array)
    .enter();

  legend.append("rect")
    .attr("width", cell_size)
    .attr("height", cell_size)
    .attr("rx", cell_size / 5).attr("ry", cell_size / 5)
    .attr("x", cal_width - 3 * margin / 4)
    .attr("y", (d, i) => {
      let distance = cell_size * 1.2;
      let start_point = (cal_height / 2) - 2.5 * distance;
      return start_point + i * distance;
    })
    .attr("fill", (d) => { return colour_scale(d); })
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  legend.append("text")
  .attr("x", cal_width - margin / 2)
  .attr("y", (d, i) => {
    let distance = cell_size * 1.2;
    let start_point = (cal_height / 2) - 2.5 * distance;
    return start_point + i * distance;
  })
  .attr("dy", ".35em")
  .text((d) => {
    let types = ["Total crimes", "Violations", "Misdemeanors", "Felonies"];
    return d + " " + types[crime_level];
  });
};

var update_calendar = (json_data, precinct, crime_level) => {
  let max_crimes = get_max_day(json_data, crime_level);
  let colour_scale = d3.scale.linear()
            .domain([0, max_crimes])
            .range(["#FFFFFF","#A50F15"]);

  d3v5.select(".cal-title")
    .text((d) => {
      let title = ["Total crimes", "Violations", "Misdemeanors", "Felonies"];
      return title[crime_level] + " per day in 2014: Precinct " + precinct;
    });

  let calendar_data = get_calendar_data(json_data, precinct, crime_level);
  d3v5.select(".calendar").selectAll(".day").transition()
    .duration(750)
    .filter((d) => {
      return d in calendar_data;
    })
    .attr("fill", (d) => { return colour_scale(calendar_data[d]); });
};

var build_line_graph = (json_data, precinct, crime_level) => {
  hour_data = get_hour_data(json_data, precinct, crime_level);

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

    let svg = d3v5.select("#linecontainer")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "line-chart")
      .append("g");

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (height - margin) + ")")
      .call(d3v5.axisBottom(xScale).ticks(data_points));

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate("+ margin + ", 0)")
      .call(d3v5.axisLeft(yScale));

    svg.append("path")
      .datum(hour_data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "black");

    svg.append("text")
      .attr("transform", "translate(" + width / 2 + "," + margin / 2 + ")")
      .attr("text-anchor", "middle")
      .attr("class", "line-title")
      .text((d) => {
        let title = ["crimes", "violations", "misdemeanors", "felonies"];
        return "Total " + title[crime_level] + " by the hour in 2014: Precinct " + precinct;
      });
};

var update_line_graph = (json_data, precinct, crime_level) => {
  let hour_data = get_hour_data(json_data, precinct, crime_level);
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

  d3v5.select(".line-title")
  .text((d) => {
    let title = ["crimes", "violations", "misdemeanors", "felonies"];
    return "Total " + title[crime_level] + " by the hour in 2014: Precinct " + precinct;
  });

  let svg = d3v5.select(".line-chart").transition();

  svg.select(".line")
      .duration(750)
      .attr("d", line(hour_data));
  svg.select(".x-axis")
      .duration(750)
      .call(d3v5.axisBottom(xScale).ticks(24));
  svg.select(".y-axis")
      .duration(750)
      .call(d3v5.axisLeft(yScale));
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
  return calendar_data;
};

var select_day = (json_data, hour_of_day, day_of_week, crime_level) => {
  dataset = [];
  let max_value = 0;
  for (let precinct in json_data) {
    // Initialize array for counting crimes by level, with totals[0] for all levels combined
    totals = [0, 0, 0, 0];
    for (let month in json_data[precinct].crimes) {
      for (let day in json_data[precinct].crimes[month]) {
        let current_day = new Date(2014, month, day).getDay();
        if (day_of_week == 7 || current_day == day_of_week) {
          for (var hour in json_data[precinct].crimes[month][day]) {
            if (hour_of_day == 24 || hour == hour_of_day) {
              for (let crime in json_data[precinct].crimes[month][day][hour]) {
                totals[json_data[precinct].crimes[month][day][hour][crime][1]]++;
              }
            }
          }
        }
      }
    }
    totals[0] = totals[1] + totals[2] + totals[3];
    max_value = Math.max(max_value, totals[crime_level]);
    dataset.push([precinct, totals[crime_level]]);
  }
  return [dataset, max_value];
};

var get_max_day = (json_data, crime_level) => {
  let curr_max = 0;
  for (let precinct in json_data) {
    dataset = get_calendar_data(json_data, precinct, crime_level);
    for (var key in dataset) {
      curr_max = Math.max(curr_max, dataset[key]);
    }
  }
  return curr_max;
};
