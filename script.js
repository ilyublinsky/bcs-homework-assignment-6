// Different ways to use the search option.
var APIKEY = "5d5c7866dcc54075c141f06a9dea4f1b";
var requestUrl = "https://api.openweathermap.org/data/2.5/weather";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast";

var weatherData;

    function render() {
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
        $.get(queryURL, req)
            .done(data => success(data, city))
            .fail(err);

        $.get(requestUrl, req)
            .done(passForecast)
            .fail(errForecast);
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
    function passForecast(data, city) {
        function display() {
            console.log(data);
            var date = new Date();
            var weatherIcon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
            var req = {
                lat: data.coord.lat,
                lon: data.coord.lon,
                appid: APIKEY
            }
            var uvIndex = "https://api.openweathermap.org/data/2.5/onecall"
           
            $.get(uvIndex, req)
                .done(uvData => {
                    $("#weather").append($("<p>UV Index: <span id='uvIndex'>" + uvData.current.uvi + "</span></p>"));
                    var uvDisplay = $("#uvIndex");
                    if (uvData.current.uvi <= 2) {
                        uvDisplay.attr("style", "color:green;")
                    }
                    else if (uvData.current.uvi > 2 && uvData.current.uvi <= 5) {
                        uvDisplay.attr("style", "color:oragne;")
                    }
                    else if (uvData.current.uvi > 5 && uvData.current.uvi <= 7) {
                        uvDisplay.attr("style", "color:orange;")
                    }
                    else if (uvData.current.uvi > 7 && uvData.current.uvi <= 10) {
                        uvDisplay.attr("style", "color:orange;")
                    }
                    else {
                        uvDisplay.attr("style", "color:indigo;")
                    }
                })
                .fail(error => console.log(error));
            $("#weather").empty();
            $("#weather").append($("<h2>" + data.name + " (" + date.toLocaleDateString() + ")" + "<img src=" + weatherIcon + "></img></h2>"));
            $("#weather").append($("<p>Temperature: " + data.main.temp + " °F</p>"));
            $("#weather").append($("<p>Humidity: " + data.main.humidity + " %</p>"));
            $("#weather").append($("<p>Wind Speed: " + data.wind.speed + " MPH</p>"));
        }
        function addHistoryButton() {
            var newSearch = $("<button>" + city + "</button>");
            newSearch.addClass("btn btn-outline-light");
            $("#search").append(newSearch);
        }
        function storeHistory() {
            weatherData.push(city);
            localStorage.setItem("Searched Cities", JSON.stringify(weatherData))
        }

        display();
        
        if (!history.includes(city)) {
            addHistoryButton();
            storeHistory();
        }
    }
    function errForecast() {
        console.log("error");
    }
        rander();

    $("#button").on("click", function (event) {
        event.preventDefault();
        var city = $("#city").val();
        $("#city").val("");
        get(city);
    });

    $("#search").on("click", "button", function () {
        get($(this).text());

    });
