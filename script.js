var APIKey = "52343a5cc20193d6a87c6cebbe614af7";

async function fetchWeatherJson(city) {
    var queryCityUrl =  "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;

    var jsonCity = await fetch(queryCityUrl)
                        .then(cityResponse => cityResponse.json())
                        .then(json => {return json});

    console.log(jsonCity);
    var queryWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + jsonCity[0].lat + "&lon=" + jsonCity[0].lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + APIKey;

    var weatherRes = await fetch(queryWeatherUrl)
                .then(response => response.json())
                .then(json => {
                        return json;
                });

    return weatherRes;
}

async function searchBtnOnClick() {
    // var city = document.getElementById("userInput").value;
    var city = "San Jose";
    var json = await fetchWeatherJson(city);

    console.log(json);

    var outerDiv = document.querySelector(".selectedCity");
    var cityHeader = document.createElement("h2");
    var date = document.createElement("h2");

    var currentWeather = document.createElement("ul");
    var tempDiv = document.createElement("li");
    var windDiv = document.createElement("li");
    var humidityDiv = document.createElement("li");
    var UVIndexDiv = document.createElement("li");

    outerDiv.appendChild(cityHeader);
    outerDiv.appendChild(date);
    currentWeather.appendChild(tempDiv);
    currentWeather.appendChild(windDiv);
    currentWeather.appendChild(humidityDiv);
    currentWeather.appendChild(UVIndexDiv);
    outerDiv.appendChild(currentWeather);

    cityHeader.innerHTML = city;
    date.innerHTML = moment().format("M/D/YYYY");
    tempDiv.innerHTML = "Temp: " + json.current.temp;
    windDiv.innerHTML = "Wind: " + json.current.wind_speed + " miles per hour";
    humidityDiv.innerHTML = "Humidity: " + json.current.humidity;
    UVIndexDiv.innerHTML = "UV Index: " + json.current.uvi;

    cityHeader.textContent(json.name);
    console.log(outerDiv);    
    console.log("complete");
}

searchBtnOnClick();

