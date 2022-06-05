var APIKey = "52343a5cc20193d6a87c6cebbe614af7";



async function fetchWeatherJson(city) {
    var queryUrl =  "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    var res = await fetch(queryUrl).then(response => response.json()).then(json => {
        return json;
    });
    console.log(res);
    return res;
}

async function searchBtnOnClick() {
    var city = document.getElementById("userInput").value;
    console.log(city);
    var json = await fetchWeatherJson(city);

    var outerDiv = document.createElement("div");
    var cityDiv = document.createElement("div");
    var tempDiv = document.createElement("div");
    var windDiv = document.createElement("div");
    var humidityDiv = document.createElement("div");
    var UVIndexDiv = document.createElement("div");

    outerDiv.appendChild(cityDiv);
    outerDiv.appendChild(tempDiv);
    outerDiv.appendChild(windDiv);
    outerDiv.appendChild(humidityDiv);
    outerDiv.appendChild(UVIndexDiv);

    cityDiv.innerHTML = json.name;
    tempDiv.innerHTML = json.main.temp;
    windDiv.innerHTML = json.wind.speed + " miles per hour";
    humidityDiv.innerHTML = json.main.humidity;
    UVIndexDiv.innerHTML = "Some UV data";

    console.log(outerDiv);    
    console.log("complete");
}