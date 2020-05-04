let historyDiv = document.getElementById("city-history");
let cityHistory = [];

$("#search-button").on("click", function () {

    let citySearch = $("#search-city").val().trim();
    let apiKey = "462e1590393042b6de4c11d6437c183d";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            let city = response.name;

            cityHistory.push(city);

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

            $(".temp-top-text").text("The current temperature in " + city + " is:");

            // Converts Kelvin to Fahrenheit
            let tempF = parseInt((response.main.temp - 273.15) * 1.80 + 32);
            $("#fTemp").text(tempF);


            // Clears input field
            $("#search-city").val("");
        }) // End AJAX call
}) // End search button function

$("#city-button").on("click", function () {

    let city = $(this).attr("id");
    console.log(city);

})