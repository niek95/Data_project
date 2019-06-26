
var get_hour_data = (json_data, precinct, crime_level) => {
  let hour_data = new Array(24).fill(0);
  for (let month in json_data[precinct].crimes) {
    for (let day in json_data[precinct].crimes[month]) {
      for (let hour in json_data[precinct].crimes[month][day]) {
        hour_data[hour] += json_data[precinct].crimes[month][day][hour][crime_level];
      }
    }
  }
  return hour_data;
};

var get_calendar_data = (json_data, precinct, crime_level) => {
  let calendar_data = {};
  for (let month in json_data[precinct].crimes) {
    for (let day in json_data[precinct].crimes[month]) {
      totals = json_data[precinct].crimes[month][day]["day-totals"];
      calendar_data[new Date(2014, month - 1, day)] = totals[crime_level];
    }
  }
  return calendar_data;
};

var select_day = (json_data, hour_of_day, day_of_week, crime_level) => {
  dataset = [];
  let max_value = 0;
  for (let precinct in json_data) {
    totals = [0, 0, 0, 0];
    for (let month in json_data[precinct].crimes) {
      for (let day in json_data[precinct].crimes[month]) {
        let current_day = new Date(2014, month, day).getDay();
        if (day_of_week == 7 || current_day == day_of_week) {
          for (let hour in json_data[precinct].crimes[month][day]) {
            if (hour_of_day == 24 || hour == hour_of_day) {
              totals = totals.map((x, i) => {
                return x + json_data[precinct].crimes[month][day][hour][i];
              });
            }
          }
        }
      }
    }
    totals[0] = totals[1] + totals[2] + totals[3];
    if (precinct != "all") {
      max_value = Math.max(max_value, totals[crime_level]);
    }
    dataset.push([precinct, totals[crime_level]]);
  }
  return [dataset, max_value];
};

var get_max_day = (json_data, crime_level) => {
  let curr_max = 0;
  let all_max = 0;
  for (let precinct in json_data) {
    for (let month in json_data[precinct].crimes) {
      for (let day in json_data[precinct].crimes[month]) {
        if (precinct == "all") {
          all_max = Math.max(all_max, json_data[precinct].crimes[month][day]["day-totals"][crime_level]);
        } else {
          curr_max = Math.max(curr_max, json_data[precinct].crimes[month][day]["day-totals"][crime_level]);
        }
      }
    }
  }
  return [curr_max, all_max];
};
