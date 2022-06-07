var APIKey = "52343a5cc20193d6a87c6cebbe614af7";

async function fetchWeatherJson(city) {
    var queryCityUrl =  "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;
    var jsonCity = await fetch(queryCityUrl)
                        .then(cityResponse => cityResponse.json())
                        .then(json => {return json});
    if (jsonCity.length == 0) {
        return [];
    }

    var queryWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + jsonCity[0].lat + "&lon=" + jsonCity[0].lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;
    var weatherRes = await fetch(queryWeatherUrl)
                .then(response => response.json())
                .then(json => {
                        return json;
                });

    return weatherRes;
}

function searchBtnOnClick() {
    var city = document.getElementById("userInput").value;
    selectedCity(city);
}

function renderHistory() {
    var keys = Object.keys(localStorage);
    
    var histories = [];

    for (var i = 0; i < keys.length; i++){
        var value = localStorage.getItem(keys[i]);
        var history = {
            city: keys[i],
            date: value
        };
        histories.push(history);
    }
    histories.sort((a,b) => b.date - a.date);
    
    var newSearchHistoryList = document.createElement("div");
    for (var i = 0; i < histories.length; i++) {
        var historyButton = document.createElement("button");
        historyButton.innerHTML = histories[i].city;
        historyButton.setAttribute("onclick", "selectedCity(\""+histories[i].city+"\")");
        newSearchHistoryList.appendChild(historyButton);
    }
    var searchHistoryList = document.querySelector(".searchHistoryList");
    searchHistoryList.innerHTML = newSearchHistoryList.innerHTML;
}

async function selectedCity(city) {
    console.log(city);
    var json = await fetchWeatherJson(city);
    if (json.length == 0) {
        alert("Invalid city");
        return;
    }

    localStorage.setItem(city, new Date());

    var outerDiv = document.querySelector(".selectedCity");
    outerDiv.innerHTML = "";
    var cityHeader = document.createElement("h2");
    var date = document.createElement("h2");

    var currentWeather = document.createElement("ul");
    var tempDiv = document.createElement("li");
    var windDiv = document.createElement("li");
    var humidityDiv = document.createElement("li");
    var UVIndexDiv = document.createElement("li");

    outerDiv.appendChild(cityHeader);
    currentWeather.appendChild(tempDiv);
    currentWeather.appendChild(windDiv);
    currentWeather.appendChild(humidityDiv);
    currentWeather.appendChild(UVIndexDiv);
    outerDiv.appendChild(currentWeather);

    date.innerHTML = moment().format("M/D/YYYY");
    cityHeader.innerHTML = city + " " + moment().format("M/D/YYYY");
    tempDiv.innerHTML = "Temp: " + json.current.temp + " °F";
    windDiv.innerHTML = "Wind: " + json.current.wind_speed + " mph";
    humidityDiv.innerHTML = "Humidity: " + json.current.humidity + " %";
    UVIndexDiv.innerHTML = "UV Index: " + json.current.uvi;

    // Future forecast
    var futureCard = document.createElement("div");
    console.log(json);
    for (var i = 1; i <= 5; i++) {
        var futureWeather = document.createElement("ul");
        var futureDate = document.createElement("li");
        var futureTemp = document.createElement("li");
        var futureWind = document.createElement("li");
        var futureHum = document.createElement("li");

        futureDate.innerHTML = moment().add(i, "day").format("M/D/YYYY");
        futureTemp.innerHTML = "Temp: " + json.daily[i].temp.day + " °F";
        futureWind.innerHTML = "Wind: " + json.daily[i].wind_speed + " mph";
        futureHum.innerHTML = "Humidity: " +json.daily[i].humidity + " %";
        futureWeather.appendChild(futureDate);
        futureWeather.appendChild(futureTemp);
        futureWeather.appendChild(futureWind);
        futureWeather.appendChild(futureHum);
        
        futureCard.appendChild(futureWeather);
    }
    
    var futureForecast = document.getElementById("5dayForcast");
    futureForecast.innerHTML = "";
    var futureForecastTitle = document.createElement("h1");
    futureForecastTitle.innerHTML = "5-Day Forecast:";
    futureForecast.appendChild(futureForecastTitle);
    futureForecast.appendChild(futureCard);

    renderHistory();
}

renderHistory();
