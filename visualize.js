window.onload = function() {
  main();
};

var main = () => {
  let crime_data = d3v5.json("Data/NYPD_crimes.json");
  console.log(crime_data);
};
