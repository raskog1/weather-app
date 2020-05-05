let historyDiv = document.getElementById("city-history");
let cityHistory = [];

$("#search-button").on("click", function () {

    let citySearch = $("#search-city").val().trim();
    let apiKey = "462e1590393042b6de4c11d6437c183d";
    let altAPI = "d98dcd8fe5c2fc97c49fcf8a578e2735";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + apiKey;
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid" + altAPI;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            let city = response.name;
            let conditions = response.weather[0].main;

            console.log(response);
            console.log(conditions);

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

            $("#today-image").attr("src", "./assets/images/stormy.jpg");

            // Converts Kelvin to Fahrenheit
            let tempF = parseInt((response.main.temp - 273.15) * 1.80 + 32);
            $("#fTemp").html(tempF + "<span>&#176</span>");

            // Populates current day weather details
            $(".temp-top-text").text("The current temperature in " + city + " is:");
            $("#humidity").html("Humidity: " + response.main.humidity + "<span>&#37</span>");
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " mph");
            $("#uvIndex").text("UV Index: Placeholder");
            $("#weather-list").append(humidity, windSpeed, uvIndex);


            // Clears input field
            $("#search-city").val("");
        }) // End AJAX call

    $.ajax({
        url: forecastURL,
        method: "GET"
    })
        .then(function (response) {

            console.log(response);

        })



}) // End search button function

$(".city-button").on("click", function () {

    let citySearch = $(this).attr("id");
    console.log(city);

})