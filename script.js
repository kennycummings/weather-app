$(document).ready(function () {
  var apiKey = '8416f57df4ffb447d2c1f1d37a1a973a';
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  var units = 'imperial';

  var searchformEl = $("#search-form");
  var cityinputEl = $("#city-input");
  var currentWeatherEl = $("#current-weather");
  var forecastEl = $("#forecast");
  var historyListEl = $("#history-list");

  searchformEl.on("submit", function (event) {
    event.preventDefault();

    var city = cityinputEl.val();

    // Log the city value to the console
    console.log("City:", city);

    // Call a function to fetch weather data
    getWeatherData(city);
  });

  function getWeatherData(city) {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      data: {
        q: city,
        appid: apiKey,
        units: units
      },
      success: function (data) {
        // Update the UI elements with the fetched data
        updateWeatherUI(data);
      },
      error: function (error) {
        console.error("Error fetching weather data:", error);
        // Handle errors and update the UI accordingly
      }
    });
  }

  function updateWeatherUI(data) {
    // Clear previous data
    currentWeatherEl.empty();
    forecastEl.empty();

    // Extract current weather details
    var currentWeather = data.list[0].main;
    var windSpeed = data.list[0].wind.speed;
    var windDeg = data.list[0].wind.deg;
    var currentIcon = data.list[0].weather[0].icon;

    // Update current weather UI
    currentWeatherEl.html(`
      <h2>${data.city.name}</h2>
      <p>Temperature: ${currentWeather.temp} °F</p>
      <p>Humidity: ${currentWeather.humidity}%</p>
      <p>Wind: ${windSpeed} m/s, ${windDeg}&deg;</p>
      <img src="https://openweathermap.org/img/w/${currentIcon}.png" alt="Current Weather Icon">
    `);

    // Extract and display 5-day forecast
    for (var i = 1; i < data.list.length; i += 8) {
      var forecast = data.list[i].main;
      var forecastWindSpeed = data.list[i].wind.speed;
      var forecastWindDeg = data.list[i].wind.deg;
      var forecastIcon = data.list[i].weather[0].icon;
      var forecastDate = dayjs(data.list[i].dt_txt).format("MMMM D");

      // Create forecast card
      var forecastCard = $(`
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${forecastDate}</h5>
              <p class="card-text">Temperature: ${forecast.temp} °F</p>
              <p class="card-text">Humidity: ${forecast.humidity}%</p>
              <p class="card-text">Wind: ${forecastWindSpeed} m/s, ${forecastWindDeg}&deg;</p>
              <img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="Forecast Icon">
            </div>
          </div>
        </div>
      `);

      // Append forecast card to the forecast element
      forecastEl.append(forecastCard);
    }
  }


  function addToHistory(city) {
    // Implement logic to add the city to the search history
    // Update the 'historyListEl' with the new city
  }
});
