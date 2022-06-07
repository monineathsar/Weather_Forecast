var APIKey = "52343a5cc20193d6a87c6cebbe614af7";

// fetches data from weather API
async function fetchWeatherJson(city) {
    // pulls all cities data available on openweather API
    var queryCityUrl =  "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;
    var jsonCity = await fetch(queryCityUrl)
                        .then(cityResponse => cityResponse.json())
                        .then(json => {return json});
    if (jsonCity.length == 0) {
        return [];
    }
    // pulls all weather data available on openweather API once city is typed in and submited in ch bar
    var queryWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + jsonCity[0].lat + "&lon=" + jsonCity[0].lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;
    var weatherRes = await fetch(queryWeatherUrl)
                .then(response => response.json())
                .then(json => {
                        return json;
                });

    return weatherRes;
}

// takes user input in search bar and runs selectedCity funtion
function searchBtnOnClick() {
    var city = document.getElementById("userInput").value;
    selectedCity(city);
}

// pulls search history from localstorage and renders to Past searches box
function renderHistory() {
    var keys = Object.keys(localStorage);
    var histories = [];
    // for every city searched, it will create an object of city & date and saved in local storage as an array
    for (var i = 0; i < keys.length; i++){
        var value = localStorage.getItem(keys[i]);
        var history = {
            city: keys[i],
            date: value
        };
        // puts history objects into histories empty array above
        histories.push(history);
    }
    // will sort the past searches by most recent to oldest search
    histories.sort((a,b) => b.date - a.date);
    
    var searchHistoryList = document.querySelector(".searchHistoryList");
    searchHistoryList.innerHTML = "";
    for (var i = 0; i < histories.length; i++) {
        var historyButton = document.createElement("button");
        historyButton.innerHTML = histories[i].city;
        historyButton.setAttribute("onclick", "selectedCity(\""+histories[i].city+"\")");
        searchHistoryList.appendChild(historyButton);
    }
}

// funtion for when search button is clicked
async function selectedCity(city) {
    // to fetch weather data from API
    var json = await fetchWeatherJson(city);
    // alert will show if city does not exist
    if (json.length == 0) {
        alert("Invalid city");
        return;
    }
    // saves recent searches with date and time in order to sort past searches buttons
    localStorage.setItem(city, new Date());

    // telling json where to put the API data
    var outerDiv = document.querySelector(".selectedCity");
    // prevents old searches from diplaying on page when there is a new search
    outerDiv.innerHTML = ""; 
    // creating header and date elements inside selected city div
    var cityHeader = document.createElement("h2");
    var date = document.createElement("h2");

    // takes the data weather API and turn into HTML elements
    var currentWeather = document.createElement("ul");
    var tempDiv = document.createElement("li");
    var windDiv = document.createElement("li");
    var humidityDiv = document.createElement("li");
    var UVIndexDiv = document.createElement("li");

    // gives UV index li an ID to change the colors of conditions below
    UVIndexDiv.setAttribute("id", "UVRating")

    //displays the data from API into selected city box
    outerDiv.appendChild(cityHeader);
    currentWeather.appendChild(tempDiv);
    currentWeather.appendChild(windDiv);
    currentWeather.appendChild(humidityDiv);
    currentWeather.appendChild(UVIndexDiv);
    outerDiv.appendChild(currentWeather);
    
    // how data will be displayed in selected city box
    date.innerHTML = moment().format("M/D/YYYY");
    cityHeader.innerHTML = city + " " + moment().format("M/D/YYYY");
    tempDiv.innerHTML = "Temp: " + json.current.temp + " °F";
    windDiv.innerHTML = "Wind: " + json.current.wind_speed + " mph";
    humidityDiv.innerHTML = "Humidity: " + json.current.humidity + " %";
    UVIndexDiv.innerHTML = "UV Index: " + json.current.uvi;

    // if else loop for UV index if conditions are favorable, moderate, or severe
    var uvRating = json.current.uvi
    if ( uvRating <= 2.99) {
        document.getElementById("UVRating").style.backgroundColor = 'green';
        } else if ( uvRating <= 5.99) {
        document.getElementById("UVRating").style.backgroundColor = 'yellow';
        } else {
        document.getElementById("UVRating").style.backgroundColor = 'red';
    }

    // creates div element for Future forecast box
    var futureCard = document.createElement("div");
    // for loop to create 5 future forecast cards
    for (var i = 1; i <= 5; i++) {
        // creates a ul card
        var futureWeather = document.createElement("ul");
        // takes each weather data and turns them into list elements
        var futureDate = document.createElement("li");
        var futureTemp = document.createElement("li");
        var futureWind = document.createElement("li");
        var futureHum = document.createElement("li");

        // how each weather date will be displayed in each furture forecast card
        futureDate.innerHTML = moment().add(i, "day").format("M/D/YYYY");
        futureTemp.innerHTML = "Temp: " + json.daily[i].temp.day + " °F";
        futureWind.innerHTML = "Wind: " + json.daily[i].wind_speed + " mph";
        futureHum.innerHTML = "Humidity: " +json.daily[i].humidity + " %";

        // diplays the weather data lists into one furture forecast card
        futureWeather.appendChild(futureDate);
        futureWeather.appendChild(futureTemp);
        futureWeather.appendChild(futureWind);
        futureWeather.appendChild(futureHum);
        
        // displays the furutre forecast cards inside future forecast box
        futureCard.appendChild(futureWeather);
    }
    
    // tells where future forecast data to go into correct box
    var futureForecast = document.getElementById("5dayForcast");
    // prevents old searches from diplaying on page when there is a new search
    futureForecast.innerHTML = "";
    // add title element to future forecast box
    var futureForecastTitle = document.createElement("h1");
    futureForecastTitle.innerHTML = "5-Day Forecast:";
    // displays the 5-day title inside the future forecast box
    futureForecast.appendChild(futureForecastTitle);
    // displays the future forecast box
    futureForecast.appendChild(futureCard);

    //re-render the history to add the newly searched city
    renderHistory();
}

renderHistory();
