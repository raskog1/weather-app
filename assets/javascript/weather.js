let historyDiv = document.getElementById("city-history");
let cityHistory = [];
let apiKey = "462e1590393042b6de4c11d6437c183d";

// Populates up to 7 buttons on page load or refresh
$(document).ready(function () {

    if (window.localStorage.length == 0) {
        getWeather("Timbuktu");
        return;
    } else {
        cityHistory = JSON.parse(localStorage.getItem("cityHistory"));

        if (cityHistory.length > 7) {
            cityHistory.length = 7;
        }

        for (i = 0; i < cityHistory.length; i++) {
            let city = cityHistory[i];
            let newCity = $("<button>").text(city).addClass("btn btn-info city-button")
                .attr("id", city);
            $("#city-history").append(newCity);
        }
        getWeather(cityHistory[0]);
    }
})

$(document).keypress(function (e) {
    if (e.which == 13) {
        let citySearch = $("#search-city").val().trim();
        getWeather(citySearch);
    }
})

$("#search-button").on("click", function () {
    let citySearch = $("#search-city").val().trim();
    getWeather(citySearch);
})

$("body").on("click", ".city-button", function () {
    getWeather($(this).attr("id"));
})

// Creates a new button
function makeButton(city) {

    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));

    if (cityHistory.length > 7) {
        historyDiv.lastElementChild.remove();
        var newCity = $("<button>").text(city).addClass("btn btn-info city-button")
            .attr("id", city);
        $("#city-history").prepend(newCity);
        cityHistory.splice(0, 1);
    } else {
        var newCity = $("<button>").text(city).addClass("btn btn-info city-button")
            .attr("id", city);
        $("#city-history").prepend(newCity);
    }
}

function checkDuplicate(city) {
    for (let i = 0; i < cityHistory.length; i++) {
        if (city === cityHistory[i]) {
            return;
        }
    }
    cityHistory.unshift(city);
    makeButton(city);
}

// API calls to obtain all weather information
function getWeather(city) {

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    // This call gets coordinates of the city to use in the One Call API in OpenWeather
    $.ajax({
        url: queryURL,
        method: "GET",
        error: function () {
            alert("Please enter a valid city.");
        },
        success: (function (response) {
            const city = response.name;
            const latitude = response.coord.lat;
            const longitude = response.coord.lon;
            const forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat="
                + latitude + "&lon=" + longitude + "&exclude=hourly&appid=" + apiKey;


            checkDuplicate(city);

            // This One Call API populates all weather detail by converting coordinates to a city
            $.ajax({
                url: forecastURL,
                method: "GET"
            })
                .then(function (response) {

                    let conditions = response.current.weather[0].main;

                    if (conditions == "Clouds") {
                        if (response.current.weather[0].description == "scattered clouds" ||
                            response.current.weather[0].description == "broken clouds") {
                            conditions = "Partly Cloudy";
                        } else {
                            conditions = "Clouds";
                        }
                    } else if (conditions == "Mist") {
                        conditions = "Haze";  // I don't have an image for Mist
                    }

                    // Populates main weather image and details
                    $("#today-image").attr("src", "./assets/images/" + conditions + ".jpg");
                    $("#today-image").attr("alt", conditions);
                    $("#temp-top-text").html("The current temperature in <strong>" + city + "</strong> is:");
                    $("#fTemp").html(convertF(response.current.temp) + "<span>&#176</span>");
                    $("#weather-description").text(conditions);

                    // Populates current day weather details
                    $("#date").text("Date: " + displayDate(response.current.dt));
                    $("#humidity").html("Humidity: " + response.current.humidity + "<span>&#37</span>");
                    $("#windSpeed").text("Wind Speed: " + response.current.wind_speed + " mph");
                    $("#uvIndex").html("UV Index: " + response.current.uvi + " <span class='dot'></span>");

                    // UV Indicator
                    if (response.current.uvi < 3.0) {
                        $(".dot").css("background-color", "green");
                        $(".dot").fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000);
                        $(".dot").fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000);
                    } else if (response.current.uvi > 7.99) {
                        $(".dot").css("background-color", "red");
                        $(".dot").fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000);
                        $(".dot").fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000);
                    } else {
                        $(".dot").css("background-color", "orange");
                        $(".dot").fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000);
                        $(".dot").fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000);
                    }

                    // Populates forecast weather images
                    for (i = 1; i < 6; i++) {
                        if (response.daily[i].weather[0].main == "Clouds") {
                            if (response.daily[i].weather[0].description == "scattered clouds"
                                || response.daily[i].weather[0].description == "broken clouds") {
                                conditions = "Partly Cloudy";
                                fillDeets(i);
                            } else {
                                conditions = "Clouds";
                                fillDeets(i);
                            }
                        } else if (response.daily[i].weather[0].main == "Mist") {
                            conditions = "Haze";  // I don't have an image for Mist
                            fillDeets(i);
                        } else {
                            conditions = response.daily[i].weather[0].main;
                            fillDeets(i);
                        }
                    }

                    function fillDeets(i) {
                        $("#forecast" + i + " img").attr("src", "./assets/images/" + conditions + ".jpg");
                        $("#forecast" + i + " .future-cond").text(conditions);
                        $("#forecast" + i + " .future-temp").html(convertF(response.daily[i].temp.day) + "<span>&#176</span>");
                        $("#forecast" + i + " .future-date").text(displayDate(response.daily[i].dt));
                    }

                    // Clears input field
                    $("#search-city").val("");

                }); // End second AJAX call
        }) // End success function of first AJAX call
    }) // End first AJAX call
}

// Convert Kelvin to Fahrenheit
function convertF(number) {
    tempF = parseInt((number - 273.15) * 1.80 + 32);
    return tempF;
}

function displayDate(data) {
    let timeStamp = data;
    let date = new Date(timeStamp * 1000);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let returnDate = month + "-" + day + "-" + year;
    return returnDate;
}
