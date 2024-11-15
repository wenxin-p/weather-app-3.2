import "./App.css";
import axios from "axios";
import { useState } from "react";

const apiKey = "04c67599a65508e4e65f4773b3e5a761";

function App() {
  const [cityInput, setCityInput] = useState("");
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState("");
  const [weatherTemp, setWeatherTemp] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [weatherDesc, setWeatherDesc] = useState("");
  const [weatherForecast, setWeatherForecast] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // uses GET request to a specified URL
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`
      )
      .then((response) => response.data[0])
      .then((cityGeoData) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${apiKey}&units=metric`
        )
      )
      .then((response) => {
        const { data: weatherData } = response;
        console.log(weatherData);

        setCityInput("");
        setCityName(weatherData.name);
        setWeather(weatherData.weather[0].main);
        setWeatherTemp(weatherData.main.temp);
        setWeatherDesc(weatherData.weather[0].description);
        setWeatherIcon(weatherData.weather[0].icon);
      });

    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`
      )
      .then((response) => response.data[0])
      .then((cityGeoData) =>
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${apiKey}&units=metric`
          )
          .then((response) => {
            const { data: weatherForecastData } = response;
            setWeatherForecast(weatherForecastData);
            console.log(weatherForecastData);
          })
      );
  };

  const weatherDisplay = cityName ? (
    <div>
      <img
        src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
        alt="weather-icon"
      />
      <p>Current City: {cityName}</p>
      <p>Current Temperature: {weatherTemp}°C</p>
      <p>Current Weather: {weatherDesc} </p>
    </div>
  ) : (
    <p>Key in a city name to see the weather</p>
  );

  const WeatherForecastData = ({ weatherForecast }) => {
    if (!weatherForecast) return null;
    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temperature</th>
            <th>Weather</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          {weatherForecast.list.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.dt * 1000).toLocaleString()}</td>
              <td>{item.main.temp}°C</td>
              <td>{item.weather[0].description}</td>
              <td>
                <img
                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <h1>Weather App</h1>
      <h4>
        Hello! Welcome to the weather app. Please input a city below to find out
        about the weather details.{" "}
      </h4>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Input a city"
          />
        </form>
        {weatherDisplay}
        {WeatherForecastData && (
          <WeatherForecastData weatherForecast={weatherForecast} />
        )}
      </div>
    </>
  );
}

export default App;
