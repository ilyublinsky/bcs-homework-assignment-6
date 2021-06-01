// Different ways to use the search option.
var APIKEY = "5d5c7866dcc54075c141f06a9dea4f1b";
var requestUrl = "https://api.openweathermap.org/data/2.5/weather";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast";

var weatherData;

    function rander() {
     $("#search").empty();
        weatherData = JSON.parse(localStorage.getItem("Searched Cities"));
        if (!weatherData) {
            weatherData = [];
        }
        for (var i = 0; i < weatherData.length; i++) {
            var city = weatherData[i];
            var button = $("<button></button>");
            button.addClass("btn btn-outline-light");
            button.text(city);
            $("#search").append(button);
        }
    }
    function forecast(hourlyUpdate) {
        console.log(hourlyUpdate);
        
        var dailyForecasts = hourlyUpdate.list.filter(forecast => forecast.dt_txt.includes('15:00:00'));
            $("#five-day-forecast").empty();
        for (var i = 0; i < dailyForecasts.length; i++) {
            var date = new Date(forecast.dt_txt).toLocaleDateString();
            var forecast = dailyForecasts[i]
            var weatherIcon = "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png";
            var temp = forecast.main.temp;
            var humidity = forecast.main.humidity;
            var card = $("<div class='card forecastCard'></div>");
            card.append("<h6>" + date + "</h6>");
            card.append("<p class='card-text'>" + "<img src=" + weatherIcon + "></img><br>Temp: " + temp + "°F<br>Humidity: " + humidity + "%</p>");
            $("#5-day-forecast").append(card);
        }
    }
    function get(city) {
        var req = {
            q: city,
            appid: APIKEY,
            units: "imperial"
        };
        $.get(query, req)
            .done(data => success(data, city))
            .fail(err);

        $.get(Url, req)
            .done(succesForcast)
            .fail(errFrocast);
    }
    function err(res) {
        console.log("error");
        if (res.status >= 400 && res.status < 500) {
            alert("Something went wrong, can you please try again?")
        }
        else if (res.status >= 500 && res.status < 600) {
            alert("When it rains, it pours. Please try again later!")
        }
        else {
            alert("Error")
        }
    }
    