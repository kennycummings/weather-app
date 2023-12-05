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
    console.log("City:", city);

    getWeatherData(city);

    addToHistory(city);
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
        updateWeatherUI(data);
      },
      error: function (error) {
        console.error("Error fetching weather data:", error);
      }
    });
  }

  function updateWeatherUI(data) {
    currentWeatherEl.empty();
    forecastEl.empty();

    var currentWeather = data.list[0].main;
    var windSpeed = data.list[0].wind.speed;
    var windDeg = data.list[0].wind.deg;
    var currentIcon = data.list[0].weather[0].icon;

    currentWeatherEl.html(`
      <h2>${data.city.name}</h2>
      <p>Temperature: ${currentWeather.temp} °F</p>
      <p>Humidity: ${currentWeather.humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
      <p>Wind Direction: ${windDeg}&deg</p>
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
              <p class="card-text">Wind: ${forecastWindSpeed} m/s</p>
              <p class="card-text">Wind Direction: ${forecastWindDeg}&deg</p>
              <img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="Forecast Icon">
            </div>
          </div>
        </div>
      `);

      forecastEl.append(forecastCard);
    }
  }

  // Save to local storage
  function addToHistory(city) {
    var history = getHistory();
    history.push(city);
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    updateHistoryUI(history);
  }

  function getHistory() {
    return JSON.parse(localStorage.getItem('weatherHistory')) || [];
  }

  function updateHistoryUI(history) {
    var historyListEl = $("#history-list");
    historyListEl.empty();

    history.forEach(function (city) {
      // Create a box around each city button
      var historyItemBox = $("<div>").addClass("history-item-box");
      var historyItem = $("<button>").addClass("list-group-item list-group-item-action").text(city);

      historyItemBox.append(historyItem);
      historyListEl.append(historyItemBox);

      // Add click event to history items
      historyItem.on("click", function () {
        getWeatherData(city);
      });
    });
  }


  // Write a GET function to have local storage city display despite a page refresh
  // Wrote part of a GET function

});

