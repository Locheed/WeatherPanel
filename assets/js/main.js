//Global variables

var locationReq = new XMLHttpRequest();
var locurl = "http://ip-api.com/json";
var lat = 0;
var lon = 0;
var xmlhttp = "";
var url = "";
var response = [];
var temp = 0;
var pressure = 0;
var windSpeed = 0;
var humidity = 0;
var mainWeather = "";
var weatherDesc = "";
var cloudiness = "";
var celcius = 0;
var fahrenheit = 0;
var visibility = 0;
var sunrise = 0;
var rain = 0;
var snow = 0;
var convertedSunrise = 0;
var convertedSunset = 0;
var sunset = 0;
var windDeg = 0;
var icon = "";
var country = "";
var city = "";
var region = "";
var coordinates = "";

// Geolocation
if (!navigator.geolocation) {
  alternateLoc();
} else {
  navigator.geolocation.getCurrentPosition(success, error);
};

function success(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;

  xmlhttp = new XMLHttpRequest();
  url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=dd466cfbfd2578f87edf06abc3100c1a";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  requestWeather(); // Calls weather after location is added to JSON link.

  console.log(lat +"   "+ lon);
};
function error() {
  alternateLoc(); // On error use alternate location
};

// Alternate geolocation, if gps not available.
locationReq.onreadystatechange = function() {
    if (locationReq.readyState == 4 && locationReq.status == 200) {
        var location = JSON.parse(locationReq.responseText);
        console.log(location);
        country = location.country;
        city = location.city;
        region = location.regionName;
        lat = location.lat;
        lon = location.lon;
        console.log(lat + "   " + lon);
        requestLocation();

    }
};

// Alternate location request
function alternateLoc() {
locationReq.open("GET", locurl, true);
locationReq.send();
};

// Assigns weather data to variables after JSON request.
function requestWeather() {
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var response = JSON.parse(xmlhttp.responseText);
        console.log(response);
        temp = response.main.temp;
        mainWeather = response.weather[0].main;
        windSpeed = response.wind.speed;
        weatherDesc = response.weather[0].description;
        cloudiness = response.clouds.all;
        pressure = response.main.pressure;
        humidity = response.main.humidity;
        icon = response.weather[0].icon;
        sunrise = response.sys.sunrise;
        sunset = response.sys.sunset;

        // If city hasn't been already set with an alternate location, set it now.
        // City and country taken from OpenWeatherMaps api, with coordinates.
        if(city == "") {
          city = response.name;
          country = response.sys.country;
          document.getElementById('location').innerHTML = city + ", " + country;
          document.getElementById('coordinates').innerHTML = "Lat: " + Math.round(lat * 100) / 100 + " Lon: " + Math.round(lon * 100) / 100;
        };

        // If rain, wind, degree or visibility data available. Assign it to variables.
        if (response.rain != undefined) {
          rain = response.rain["1h"];

        }
          else if (response.snow != undefined) {
            snow = response.snow["1h"];
          }
          else {
            document.getElementById('rainSnow').innerHTML = "No data available";
          };
            console.log("WindDeg: " + windDeg);
            console.log("Rain: " + rain);

        if (response.wind.deg != undefined) {
          windDeg = response.wind.deg;
        }
          else {
            windDeg = "n/a";
          };

        if (response.visibility != undefined) {
          visibility = response.visibility;
        }
          else {
            visibility = "No data available";
          };

        timeConversion();
        outputWeather();
        rotateArrow();



    }
};
};


// Toggles between celcius and fahrenheit, when temperature is clicked.
function toggleTemp() {
  document.getElementById('temp').classList.toggle("celcius");
  document.getElementById('temp').classList.toggle("fahrenheit");

if (document.getElementById('temp').classList.contains('fahrenheit')) {
  document.getElementById('temp').innerHTML = fahrenheit + ' <span="CF">&deg;F</span>';

}
else {
  document.getElementById('temp').innerHTML = celcius + ' <span="CF">&deg;C</span>';

}

};

// Outputs weather data to HTML DOM.
function outputWeather() {

  celcius =  Math.round(((temp - 273.15) * 10)) / 10;
  fahrenheit = Math.round(temp * 9 / 5 - 459.67);

  document.getElementById('temp').innerHTML = celcius + ' <span="CF">&deg;C</span>';
  document.getElementById('weather').innerHTML = mainWeather;
  document.getElementById('wind').innerHTML = windSpeed + " m/s, " + windDeg +" deg";
  document.getElementById('weatherDesc').innerHTML = weatherDesc;
  document.getElementById('cloudiness').innerHTML = cloudiness + " %";
  document.getElementById('pressure').innerHTML = pressure + " hpa";
  document.getElementById('humidity').innerHTML = humidity + " %";
  document.getElementById('visibility').innerHTML = visibility;
  document.getElementById('icon').src = "assets/img/icons/" + icon + ".png";
  document.getElementById('sunrise').innerHTML = convertedSunrise;
  document.getElementById('sunset').innerHTML = convertedSunset;

  if (rain > 0) {
    document.getElementById('rain-bar-amount').style.width = rain + "mm";
    document.getElementById('millimeters').innerHTML = rain + "mm";
    document.getElementById('rainSnow').innerHTML = "Rain: " + rain + "mm";

  }
    else if (snow > 0) {
      document.getElementById('rain-bar-amount').style.width = snow + "mm";
      document.getElementById('millimeters').innerHTML = snow + "mm";
      document.getElementById('rainSnow').innerHTML = "Snow: " + snow + "mm";
    }

};

// Outputs location and gives coordinate attributes to weather request. Alternate method.
function requestLocation() {
  document.getElementById('location').innerHTML = city + ", " + country;
  document.getElementById('region').innerHTML = region;
  document.getElementById('coordinates').innerHTML = "Lat: " + Math.round(lat * 100) / 100 + " Lon: " + Math.round(lon * 100) / 100;

  xmlhttp = new XMLHttpRequest();
  url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=dd466cfbfd2578f87edf06abc3100c1a";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  requestWeather(); // Calls weather after location is added to JSON link.
  console.log(url);
};

// Converts unix time to local date and time.
function timeConversion() {
  convertedSunrise = new Date(sunrise * 1000).toLocaleTimeString('en-GB');
  convertedSunset = new Date(sunset * 1000).toLocaleTimeString('en-GB');
};

// Rotates compass arrow by the wind degree value.
function rotateArrow() {
  document.getElementById('arrow').style.transform = "rotate(" + (windDeg - 45) +"deg)";
};

// Toggles animation classess.
function toggleClass() {
  var toggleClass = document.getElementsByClassName('main-weather-container')[0].classList;
  toggleClass.remove("slideIn");

  if (toggleClass.contains("slide-out")) {
    toggleClass.remove("slide-out");
  }
    else {
      toggleClass.add("slide-out");
    };
};

// After animation redirects page to a new page.
function pageForecast() {
  toggleClass();

  setTimeout(function() {
    window.location.href = "forecast.html";

  }, 2400);

};

function pageIndex() {
  toggleClass();
  setTimeout(function() {
    window.location.href = "index.html";

  }, 2400);
};
