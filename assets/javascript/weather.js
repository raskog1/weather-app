let historyDiv = document.getElementById("city-history");
let cityHistory = [];

$("#search-button").on("click", function () {

    let citySearch = $("#search-city").val().trim();
    let apiKey = "462e1590393042b6de4c11d6437c183d";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + apiKey;

    // Assigns latitude and longitude variables
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            let latitude = response.coord.lat;
            let longitude = response.coord.lon;
            // let tempF;
            let city = response.name;
            let forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=hourly&appid=" + apiKey;

            $.ajax({
                url: forecastURL,
                method: "GET"
            })
                .then(function (response) {

                    console.log(response);

                    let conditions = response.current.weather[0].main;

                    cityHistory.push(city);
                    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));

                    if (cityHistory.length > 7) {
                        historyDiv.lastElementChild.remove();
                        let newCity = $("<button>").text(city).addClass("btn btn-info city-button")
                            .attr("id", city);
                        $("#city-history").prepend(newCity);
                        cityHistory.splice(0, 1);
                    } else {
                        let newCity = $("<button>").text(city).addClass("btn btn-info city-button")
                            .attr("id", city);
                        $("#city-history").prepend(newCity);
                    }

                    $("#today-image").attr("src", "./assets/images/" + conditions + ".jpg");
                    $("#today-image").attr("alt", conditions);
                    $("#fTemp").html(convertF(response.current.temp) + "<span>&#176</span>");
                    $("#weather-description").text(conditions);

                    // Populates current day weather details
                    $("#temp-top-text").text("The current temperature in " + city + " is:");
                    $("#humidity").html("Humidity: " + response.current.humidity + "<span>&#37</span>");
                    $("#windSpeed").text("Wind Speed: " + response.current.wind_speed + " mph");
                    $("#uvIndex").text("UV Index: " + response.current.uvi);
                    $("#weather-list").append(humidity, windSpeed, uvIndex);

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

                }) // End AJAX call
        })
}) // End search button function

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

$(".city-button").on("click", function () {
    let citySearch = $(this).attr("id");
    console.log(city);
})
