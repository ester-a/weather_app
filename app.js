let cityInput = document.querySelector("#city_input");
let searchButton = document.querySelector("#button_search");
let locationButton = document.querySelector('#location_button');
let currentWeatherCard = document.querySelectorAll(".weather_left .card")[0];
let fiveDaysForecastCard = document.querySelector(".day_forecast");
let aqiCard = document.querySelectorAll(".highlights .card")[0];
let sunriseCard = document.querySelectorAll(".highlights .card")[1];
let humidityValue = document.querySelector("#humidity_value");
let preasureValue = document.querySelector("#preasure_value");
let visibilityValue = document.querySelector("#visibility_value");
let windSpeedValue = document.querySelector("#wind_speed_value");
let feelsValue = document.querySelector("#feels_value");
let hourlyForecastCard = document.querySelector(".hourly_forecast");
let aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
  (days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]),
    (months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]);

  fetch(AIR_POLLUTION_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { pm2_5, pm10, so2, co, no, no2, nh3, o3 } = data.list[0].components;
      aqiCard.innerHTML = `
                    <div class="card_head">
                            <p>Air Quality Index</p>
                            <p class="air_index aqi-${data.list[0].main.aqi}">${
        aqiList[data.list[0].main.aqi - 1]
      }</p>
                        </div>
                        <div class="air_indices">
                            <i class="fa-solid fa-wind"></i>
                            <div class="item">
                                <p>PM2.5</p>
                                <h2>${pm2_5}</h2>
                            </div>
                            <div class="item">
                                <p>PM10</p>
                                <h2>${pm10}</h2>
                            </div>
                            <div class="item">
                                <p>SO2</p>
                                <h2>${so2}</h2>
                            </div>
                            <div class="item">
                                <p>CO</p>
                                <h2>${co}</h2>
                            </div>
                            <div class="item">
                                <p>NO</p>
                                <h2>${no}</h2>
                            </div>
                            <div class="item">
                                <p>NO2</p>
                                <h2>${no2}</h2>
                            </div>
                            <div class="item">
                                <p>NH3</p>
                                <h2>${nh3}</h2>
                            </div>
                            <div class="item">
                                <p>O3</p>
                                <h2>${o3}</h2>
                            </div>
                    </div>`;
    })
    .catch((error) => {
      console.log(error);
      alert(`Failed to fetch Air Quality Index`, error);
    });

  // API returns temperature in K, so it has to be converted to °C,
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
              <div class="current_weather">
                        <div class="details">
                            <p>Now</p>
                            <h2>${(data.main.temp - 273.15).toFixed(
                              2
                            )}&deg;C</h2> 
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weather_icon">
                            <img src="https://openweathermap.org/img/wn/${
                              data.weather[0].icon
                            }@2x.png" alt="">
                        </div>
                    </div>
                    <hr>
                    <div class="card_footer">
                        <p><i class="fa-regular fa-calendar"></i>${
                          days[date.getDay()]
                        }, ${date.getDate()}, 
                        ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                        <p><i class="fa-solid fa-location-dot"></i>${name}, ${country}</p>
                    </div>`;
      let { sunrise, sunset } = data.sys;
      let { timezone, visibility } = data,
        { humidity, pressure, feels_like } = data.main,
        { speed } = data.wind,
        sRiseTime = moment
          .utc(sunrise, "X")
          .add(timezone, "seconds")
          .format("hh:mm A");
      sSetTime = moment
        .utc(sunset, "X")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sunriseCard.innerHTML = `
                        <div class="card_head">
                            <p>Sunrise & Sunset</p>
                        </div>
                        <div class="sunrise_sunset">
                            <div class="item">
                                <div class="icon">
                                    <i class="fa-regular fa-sun"></i>
                                </div>
                                <div>
                                    <p>Sunrise</p>
                                    <h2>${sRiseTime}</h2>
                                </div>
                            </div>
                            <div class="item">
                                <div class="icon">
                                    <i class="fa-regular fa-moon"></i>
                                </div>
                                <div>
                                    <p>Sunset</p>
                                    <h2>${sSetTime}</h2>
                                </div>
                            </div>
                        </div>

                    `;
      humidityValue.innerHTML = `${humidity}%`;
      preasureValue.innerHTML = `${pressure}hPa`;
      visibilityValue.innerHTML = `${visibility / 1000}km`;
      windSpeedValue.innerHTML = `${speed}m/s`;
      feelsValue.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    })
    .catch((error) => {
      console.log(error);
      alert(`Failed to fetch current weather`, error);
    });

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let hourlyForecast = data.list;
      hourlyForecastCard.innerHTML = "";
      for (let i = 0; i <= 7; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) a = "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr = hr - 12;
        hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
        `;
      }
      let uniqueForecastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      fiveDaysForecastCard.innerHTML = "";
      for (let i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
                        <div class="forecast_item">
                            <div class="icon_wrapper">
                                <img src="https://openweathermap.org/img/wn/${
                                  fiveDaysForecast[i].weather[0].icon
                                }.png" alt="">
                                <span>${(
                                  fiveDaysForecast[i].main.temp - 273.15
                                ).toFixed(2)}&deg;C</span>
                            </div>
                            <p>${date.getDate()} ${months[date.getMonth()]}</p>
                            <p>${days[date.getDay()]}</p>
                        </div>
            `;
      }
    })
    .catch((error) => {
      console.log(error);
      alert(`Failed to fetch weather forecast`, error);
    });
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&
    limit=1&appid=${api_key}`;
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        console.log(latitude, longitude);
        let REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL).then((res) => res.json()).then((data) => {
            console.log(data);
        })
        .catch(() => {
            alert(`Failed to fetch user coordinates`);
          });
    }, error => {
        if(error.code === error.PERMISSION_DENIED) {
            alert('Geolocation permission denied.')
        }
    });
}

searchButton.addEventListener('click', getCityCoordinates);
locationButton.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates())
