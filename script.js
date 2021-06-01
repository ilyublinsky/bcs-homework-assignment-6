// Different ways to use the search option.
var APIKEY = "5d5c7866dcc54075c141f06a9dea4f1b";
var requestUrl = ('https://api.openweathermap.org/data/2.5/weather?id=');
var city = $("");
var search = $("#search-button");
var date = $("");
var temperature = $("#terperature");
var icon = $("#weatherIcon");
var windSpeed = $("#wind");
var humidity = $("#humidity");
var uvIndex = $("#uvLight");
var currentWeatherResults = $("#results");
var forecastDisplay = $("#fiveDayForecast");
var cityResults;

if (localStorage.getItem("localWeatherSearches")) {
    citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches"));
    writeSearchHistory(citiesResults);
} else {
    citiesResults = [];
};


function weatherConditions(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let date = new Date(response.dt*1000);
        let icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

        currentWeatherResults.html(`
        <h3>${response.name}, 
        ${response.sys.country} 
        (${currTime.getMonth()+1}/${currTime.getDate()}/${currTime.getFullYear()})
        <img src=${weatherIcon}></h3>
        <p>Temperature: ${response.main.temp} &#176;C</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} m/s</p>
        `, returnUVIndex(response.coord))
        createHistoryButton(response.name);
    })
};

function returnWeatherForecast(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let forecastInfo = response.list;
        forecastDiv.empty();
        $.each(forecastInfo, function(i) {
            if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
                return;
            }
            let forecastDate = new Date(forecastInfo[i].dt*1000);
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

            forecastDiv.append(`
            <div class="col-md">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${forecastInfo[i].main.temp} &#176;C</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                    </div>
                </div>
            </div>
            `)
        })
    })
};

// The current UV index is collected at the same time as the current weather
// by making use of the searched city's returned coordinates
function returnUVIndex(coordinates) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let currUVIndex = response.value;
        let uvSeverity = "green";
        let textColour = "white"
        //Change UV background based on severity
        //Also change text colour for readability
        if (currUVIndex >= 11) {
            uvSeverity = "purple";
        } else if (currUVIndex >= 8) {
            uvSeverity = "red";
        } else if (currUVIndex >= 6) {
            uvSeverity = "orange";
            textColour = "black"
        } else if (currUVIndex >= 3) {
            uvSeverity = "yellow";
            textColour = "black"
        }
        currWeatherDiv.append(`<p>UV Index: <span class="text-${textColour} uvPadding" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);
    })
}

function createHistoryButton(cityName) {
    // Check if the button exists in history, and if it does, exit the function
    var citySearch = cityName.trim();
    var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
    if (buttonCheck.length == 1) {
      return;
    }
    
    if (!citiesArray.includes(cityName)){
        citiesArray.push(cityName);
        localStorage.setItem("localWeatherSearches", JSON.stringify(citiesArray));
    }

    $("#previousSearch").prepend(`
    <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}

function writeSearchHistory(array) {
    $.each(array, function(i) {
        createHistoryButton(array[i]);
    })
}

// Get a deafult weather search
returnCurrentWeather("Toronto");
returnWeatherForecast("Toronto");

$("#submitCity").click(function() {
    event.preventDefault();
    let cityName = $("#cityInput").val();
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
});

$("#previousSearch").click(function() {
    let cityName = event.target.value;
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
})


// Calling the search function
// $(document).ready(function() {
//   $("#submit").on("click", function() {
//     var searchResults = $('#search').value();
//     console.log(('#search').value());
//   }
// }
//Adding loop for storage
// for (var i = 0; i < localStorage.length; i++) {
//   var city = localStorage.getItem(i);
//   var cityName = $(".list-group").addClass("list-group-item");
// }

//   cityName.append("<li>" + city + "</li>");
// function weatherCondition(city) {
//   var APIKEY = '{5d5c7866dcc54075c141f06a9dea4f1b}';
//   fetch('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?' + city+ '&appid=' + APIKEY)  
//   .then(function(resp) { 
//     return resp.json() 
//   })
//   .then(function(data) {
//   })
//   .catch(function() {
//   })
//   console.log(data);
// }
