window.onload = function() {
  main();
};

var main = async () => {
  let json_data = await d3v5.json("/Data_project/Code/Data/NYPD_crimes_new.json");
  //console.log(json_data)
  crime_select = document.getElementById("crimeselect");
  all_button = document.getElementById("all-button");

  start_colour = "#FFFFFF";
  main_colour = "#A50F15";

  // add dummy precinct to json, to show calendar and line chart of all precicnts
  selected_precinct = "all";
  selected_hour = 24;
  selected_day = 7;

  var map = build_map(json_data);
  window.addEventListener("resize", function() {
    map.resize();
  });

  build_inputs(json_data, map);
  build_calendar(json_data, selected_precinct, crime_select.value);
  build_line_graph(json_data, selected_precinct, crime_select.value);

  crime_select.onchange = () => {
    update_calendar(json_data, selected_precinct, crime_select.value);
    update_line_graph(json_data, selected_precinct, crime_select.value);
    update_map(map, json_data);
  };

  all_button.onclick = () => {
    selected_precinct = "all";
    update_calendar(json_data, selected_precinct, crime_select.value);
    update_line_graph(json_data, selected_precinct, crime_select.value);
    update_map(map, json_data);
  };
};

var build_inputs = (json_data, map) => {
  let input_width = document.getElementById("inputcontainer").clientWidth;
  let input_height = document.getElementById("inputcontainer").clientHeight;
  let margin = 20;
  var slider_day = d3v5
    .sliderBottom()
    .min(0)
    .max(7)
    .height(input_height - margin)
    .width(input_width / 3 - margin)
    .ticks(7)
    .tickFormat((d) => {
      days = ["Su","Mo","Tu","We","Th","Fr","Sa", "All"];
      return days[d];
    })
    .step(1)
    .default(7)
    .on("onchange", d => {
      slider_hour.value(24);
      selected_day = d;
      update_map(map, json_data);
    });

  var slider_hour = d3v5
    .sliderBottom()
    .min(0)
    .max(24)
    .height(input_height - margin)
    .width(input_width / 3 - margin)
    .ticks(25)
    .tickFormat((d) => {
      if (d == 24) {
        return "Whole day";
      } else {
        return d;
      }
    })
    .step(1)
    .default(25)
    .on("onchange", d => {
      slider_day.value(7);
      selected_hour = d;
      update_map(map, json_data);
    });

  let svg_day = d3v5
    .select(".sliders")
    .append("svg")
    .attr("class", "slider-day")
    .attr("x", 0)
    .attr("y", input_height / 2)
    .attr("width", input_width / 2)
    .attr("height", input_height / 2)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin +")");

  let svg_hour = d3v5
    .select(".sliders")
    .append("svg")
    .attr("class", "slider-hour")
    .attr("x", input_width / 2)
    .attr("y", input_height / 2)
    .attr("width", input_width / 2)
    .attr("height", input_height / 2)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin +")");

  svg_day.call(slider_day);
  svg_hour.call(slider_hour);
};

var build_map = (json_data) => {
  let crime_data = select_day(json_data, selected_hour, selected_day, crime_select.value);
  let map_width = document.getElementById("mapcontainer").clientWidth;
  let map_height = document.getElementById("mapcontainer").clientHeight;
  var colour_data = {};
  let palette_scale = d3.scale.linear()
            .domain([0, crime_data[1]])
            .range([start_colour, main_colour]);
  crime_data[0].forEach(item => {
        let iso = item[0], value = item[1];
        colour_data[iso] = {numberOfThings: value, fillColor: palette_scale(value)};
    });

  var map = new Datamap({
    element: document.getElementById("mapcontainer"),
    responsive: true,
    aspectRatio: 0.9,
    data: colour_data,
    geographyConfig: {
      dataUrl: "/Data_project/Code/Data/precincts.json",
      popupTemplate: function(geo, data) {
        return ['<div class="hoverinfo"><strong>',
                "Precinct: " +
                geo.properties.precinct.slice(1),
                ': ' + data.numberOfThings,
                '</strong></div>'].join('');
      }
    },
    scope: "Police Precincts",
    setProjection: (element, options) => {
      var projection, path;
      projection = d3.geo.equirectangular()
          .center([-73.65, 40.67])
          .scale(45000);
      path = d3.geo.path()
        .projection(projection);
      return {path: path, projection: projection};
   },
   done: datamap => {
     datamap.svg.selectAll(".datamaps-subunit").on("click", geography => {
       selected_precinct = geography.properties.precinct;
       if (document.getElementsByClassName("calendar").length == 0) {
         build_calendar(json_data, selected_precinct, crime_select.value);
       } else {
         update_calendar(json_data, selected_precinct, crime_select.value);
       }
       if (document.getElementsByClassName("line-chart").length == 0) {
         build_line_graph(json_data, selected_precinct, crime_select.value);
       } else {
         update_line_graph(json_data, selected_precinct, crime_select.value);
       }
     });
   }
  });

  let title = () => {
    if (selected_day == 7) {
      if (selected_hour == 24) {
        let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
        return crimes[crime_select.value] + " in 2014";
      } else {
        let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
        return crimes[crime_select.value] + " between " + selected_hour + "-" + (parseInt(selected_hour) + 1) + " o'clock in 2014";
      }
    } else {
      let days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
      let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
      return crimes[crime_select.value] + " on " + days[selected_day] + " in 2014";
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
      .attr("stop-color", main_colour);

  let legend_width = map_width / 3;
  let legend_height = map_height / 25;
  let legend_values = [0, 0.2, 0.4, 0.6, 0.8, 1];
  let legend_x = legend_width;
  let legend_y = map_height - 40;
  legend_values = legend_values.map((x) => { return Math.floor(crime_data[1] * x); });

  svg.append("rect")
      .attr("width", legend_width)
      .attr("height", legend_height)
      .style("fill", "url(#linear-gradient)")
      .attr("x", legend_x)
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

  return map;
};

var update_map = (map, json_data) => {
  let crime_data = select_day(json_data, selected_hour, selected_day, crime_select.value);
  var colour_data = {};
  let palette_scale = d3.scale.linear()
            .domain([0, crime_data[1]])
            .range([start_colour, main_colour]);
  crime_data[0].forEach(item => {
        let iso = item[0], value = item[1];
        colour_data[iso] = {numberOfThings: value, fillColor: palette_scale(value)};
    });

  let legend_values = [0, 0.2, 0.4, 0.6, 0.8, 1];
  legend_values = legend_values.map((x) => { return Math.floor(crime_data[1] * x); });

  svg = d3v5.select(".datamap");

  svg.selectAll(".legend-values")
    .data(legend_values)
    .text((d) => { return d; })
    .attr("text-anchor", "middle")
    .attr("font-size", 10);

  let title = () => {
    if (selected_day == 7) {
      if (selected_hour == 24) {
        let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
        return crimes[crime_select.value] + " in 2014";
      } else {
        let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
        return crimes[crime_select.value] + " between " + selected_hour + "-" + (parseInt(selected_hour) + 1) + " o'clock in 2014";
      }
    } else {
      let days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
      let crimes = ["All crime", "Violations", "Misdemeanors", "Felonies"];
      return crimes[crime_select.value] + " on " + days[selected_day] + " in 2014";
    }
  };

  svg.select(".map-title")
    .text(title);

  map.updateChoropleth(colour_data);
};

var build_calendar = (json_data, precinct, crime_level) => {
  let width = document.getElementById("calcontainer").clientWidth;
  let height = document.getElementById("calcontainer").clientHeight;
  let margin = width / 15;
  let month_margin = 3;
  let cell_size = (width - 2 * margin - 12 * month_margin) / 53;
  let cal_height = 2 * margin + 7 * cell_size;
  let calendar_data = get_calendar_data(json_data, precinct, crime_level);
  let day = d3v5.timeFormat("%w");
  let week = d3v5.timeFormat("%U");
  let month = d3v5.timeFormat("%m");
	let format = d3v5.timeFormat("%Y%m%d");
  let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let max_crimes = 0;
  if (precinct == "all") {
    max_crimes = get_max_day(json_data, crime_level)[1];
  } else {
    max_crimes = get_max_day(json_data, crime_level)[0];
  }
  let colour_scale = d3.scale.linear()
            .domain([0, max_crimes])
            .range([start_colour, main_colour]);

  let svg = d3v5.select("#calcontainer")
    .append("svg")
    .attr("width", width)
    .attr("height", cal_height)
    .attr("class", "calendar")
    .append("g");

let week_days = ["Su","Mo","Tu","We","Th","Fr","Sa"];
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
      return margin + i * (width - 2 * margin) / 12;
    })
    .attr("y", 4 * margin / 5)
    .attr("text-anchor", "start")
    .text((d,i) => { return months[i]; });

  d3v5.select(".calendar")
    .append("text")
    .attr("class", "cal-title")
    .attr("transform", "translate(" + width / 2 + "," + margin / 2 + ")")
    .attr("text-anchor", "middle")
    .text((d) => {
      let title = ["Total crimes", "Violations", "Misdemeanors", "Felonies"];
      if (precinct == "all") {
        return title[crime_level] + " per day in 2014: All precincts";
      }
      return title[crime_level] + " per day in 2014: Precinct " + precinct.slice(1);
    });

  svg = d3v5.select(".calendar").append("g").attr("class", "cal-legend");

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
      .attr("stop-color", main_colour);

  let legend_width = (width - 2 * margin) / 3;
  let legend_height = 20;
  let legend_values = [0, 0.2, 0.4, 0.6, 0.8, 1];
  let legend_x = legend_width + margin;
  let legend_y = cal_height - 40;
  legend_values = legend_values.map((x) => { return Math.floor(max_crimes * x); });

  svg.append("rect")
      .attr("width", legend_width)
      .attr("height", legend_height)
      .style("fill", "url(#linear-gradient)")
      .attr("x", legend_x)
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

var update_calendar = (json_data, precinct, crime_level) => {
  let max_crimes = 0;
  if (precinct == "all") {
    max_crimes = get_max_day(json_data, crime_level)[1];
  } else {
    max_crimes = get_max_day(json_data, crime_level)[0];
  }
  let colour_scale = d3.scale.linear()
            .domain([0, max_crimes])
            .range([start_colour, main_colour]);

  d3v5.select(".cal-title")
    .text((d) => {
      let title = ["Total crimes", "Violations", "Misdemeanors", "Felonies"];
      if (precinct == "all") {
        return title[crime_level] + " per day in 2014: All precincts";
      }
      return title[crime_level] + " per day in 2014: Precinct " + precinct.slice(1);
    });

  let calendar_data = get_calendar_data(json_data, precinct, crime_level);
  let svg = d3v5.select(".calendar");

  svg.selectAll(".day").transition()
    .duration(750)
    .filter((d) => {
      return d in calendar_data;
    })
    .attr("fill", (d) => { return colour_scale(calendar_data[d]); });

  let legend_values = [0, 0.2, 0.4, 0.6, 0.8, 1];
  legend_values = legend_values.map((x) => { return Math.floor(max_crimes * x); });

  svg.selectAll(".legend-values")
    .data(legend_values)
    .text((d) => { return d; })
    .attr("text-anchor", "middle")
    .attr("font-size", 10);
};

var build_line_graph = (json_data, precinct, crime_level) => {
  hour_data = get_hour_data(json_data, precinct, crime_level);

  let width = document.getElementById("linecontainer").clientWidth;
  let height = document.getElementById("linecontainer").clientHeight;
  let margin = height / 10;
  let data_points = 24;

  let xScale = d3v5.scaleLinear()
    .domain([0, data_points - 1])
    .range([margin, Math.min(width,height) - margin]);

  let yScale = d3v5.scaleLinear()
    .domain([0, Math.max(...hour_data)])
    .range([Math.min(width,height) - margin, margin]);

  let line = d3v5.line()
    .x((d, i) => {
      return xScale(i);
    })
    .y((d) => {
      return yScale(d);
    });

    let svg = d3v5.select("#linecontainer")
      .append("svg")
      .attr("viewBox", "0 0 " + Math.min(width,height) + " " + Math.min(width,height))
      .attr("preserveAspectRatio","xMidYMid meet")
      .append("g")
      .attr("class", "line-chart");

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (height - margin) + ")")
      .call(d3v5.axisBottom(xScale).ticks(data_points));

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate("+ margin + ", 0)")
      .call(d3v5.axisLeft(yScale));

    svg.selectAll("horizontal-grid")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("class", "horizontal-grid")
      .attr("x1", margin)
      .attr("x2", Math.min(width,height) - margin)
      .attr("y1", (d) => { return yScale(d);})
      .attr("y2", (d) => { return yScale(d);})
      .attr("stroke", "black")
      .attr("stroke-width", "1px");

    svg.selectAll("vertical-grid")
      .data(xScale.ticks())
      .enter()
      .append("line")
      .attr("class", "vertical-grid")
      .attr("x1", (d) => { return xScale(d);})
      .attr("x2", (d) => { return xScale(d);})
      .attr("y1", margin)
      .attr("y2", Math.min(width,height) - margin)
      .attr("stroke", "black")
      .attr("stroke-width", "1px");

    svg.append("path")
      .datum(hour_data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", main_colour);

    svg.append("text")
      .attr("transform", "translate(" + width / 2 + "," + margin / 2 + ")")
      .attr("text-anchor", "middle")
      .attr("class", "line-title")
      .text((d) => {
        let title = ["Total crimes", "Violations", "Misdemeanors", "Felonies"];
        if (precinct == "all") {
          return title[crime_level] + " by the hour in 2014: All precincts";
        }
        return title[crime_level] + " by the hour in 2014: Precinct " + precinct.slice(1);
      });
};

var update_line_graph = (json_data, precinct, crime_level) => {
  let hour_data = get_hour_data(json_data, precinct, crime_level);
  let width = document.getElementById("linecontainer").clientWidth;
  let height = document.getElementById("linecontainer").clientHeight;
  let margin = height / 10;
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
    let title = ["Total crimes", "Violations", "Misdemeanors", "Felonies"];
    if (precinct == "all") {
      return title[crime_level] + " by the hour in 2014: All precincts";
    }
    return title[crime_level] + " by the hour in 2014: Precinct " + precinct.slice(1);
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