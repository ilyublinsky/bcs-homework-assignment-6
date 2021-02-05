// Different ways to use the search option.
var APIKEY = "5d5c7866dcc54075c141f06a9dea4f1b";
var requestUrl = ('https://api.openweathermap.org/data/2.5/weather?id=');
var city = $("");
var date = $("");
var temperature = $("terperature");
var windSpeed = $("wind");
var humidity = $("humidity");
var uvIndex = $("uvLight");

// Calling the search function
$(document).ready(function() {
  $("#search").on("click", function() {
    var searchResults = $('#search').value();
    console.log(('#search').value());
  }
}

function weather-condition(city) {
  var APIKEY = '{5d5c7866dcc54075c141f06a9dea4f1b}';
  fetch('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?' + city+ '&appid=' + APIKEY)  
  .then(function(resp) { 
    return resp.json() 
  })
  .then(function(data) {
  })
  .catch(function() {
  });
}
