// Global variables

var locationReq = new XMLHttpRequest();
var locurl = "http://ip-api.com/json";
var lat = 0;
var lon = 0;
var xmlhttp = "";
var url = "";
var response = [];
var pressure = [];
var windSpeed = [];
var humidity = [];
var mainWeather = "";
var weatherDesc = [];
var cloudiness = [];
var celcius = 0;
var fahrenheit = 0;
var visibility = [];
var rain = [];
var snow = [];
var convertedTime = [];
var windDeg = [];
var icon = [];
var tempArr = [];
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
  url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=dd466cfbfd2578f87edf06abc3100c1a";
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
        var countItems = response.cnt;

        // If city hasn't been already set with an alternate location, set it now.
        // City and country taken from OpenWeatherMaps api, with coordinates.
        if(city == "") {
          city = response.city.name;
          country = response.city.country;
          document.getElementById('location').innerHTML = city + ", " + country;
        };

        // Loop through API request and assing data to variables.
        for (i = 0; i < countItems; i = i + 8) {

          tempArr.push(response.list[i].main.temp);
          windSpeed.push(response.list[i].wind.speed);

          weatherDesc.push(response.list[i].weather[0].description);
          cloudiness.push(response.list[i].clouds.all);
          pressure.push(parseInt(response.list[i].main.pressure));
          humidity.push(response.list[i].main.humidity);
          icon.push(response.list[i].weather[0].icon);
          convertedTime.push(response.list[i].dt);

          // If rain, wind, degree or visibility data available. Assign it to variables.
          if (response.list[i].rain != undefined) {
            rain.push(response.list[i].rain["1h"]);

          }
            else if (response.list[i].snow != undefined) {
              snow.push(response.list[i].snow["1h"]);
            }
            else {
              document.getElementsByClassName('rainSnow')[i].innerHTML = "n/a";
            };


          if (response.list[i].wind.deg != undefined) {
            windDeg.push(parseInt(response.list[i].wind.deg));

          }
            else {
              windDeg.push("n/a");
            };

          if (response.list[i].visibility != undefined) {
            visibility.push(response.list[i].visibility);
          }
            else {
              visibility.push("n/a");
            };
        };

        timeConversion();
        outputWeather();




    }
};
};

// Outputs weather data to HTML DOM.
function outputWeather() {

  for (i=0; i < 5; i++) {
    celcius =  Math.round(((tempArr[i] - 273.15) * 10)) / 10;
    fahrenheit = Math.round(tempArr[i] * 9 / 5 - 459.67);

  document.getElementsByClassName('temp')[i].innerHTML = celcius + ' <span="CF">&deg;C</span>';
  document.getElementsByClassName('wind')[i].innerHTML = windSpeed[i] + " m/s, " + windDeg[i] +" deg";
  document.getElementsByClassName('weatherDesc')[i].innerHTML = weatherDesc[i];
  document.getElementsByClassName('cloudiness')[i].innerHTML = cloudiness[i] + " %";
  document.getElementsByClassName('pressure')[i].innerHTML = pressure[i] + " hpa";
  document.getElementsByClassName('humidity')[i].innerHTML = humidity[i] + " %";
  document.getElementsByClassName('visibility')[i].innerHTML = visibility[i];
  document.getElementsByClassName('weather-icons')[i].src = "assets/img/icons/" + icon[i] + ".png";

  if (rain > 0) {
    document.getElementsByClassName('rain-bar-amount')[i].style.width = rain[i] + "mm";
    document.getElementsByClassName('millimeters')[i].innerHTML = rain[i] + "mm";
    document.getElementsByClassName('rainSnow')[i].innerHTML = "Rain: " + rain[i] + "mm";

  }
    else if (snow > 0) {
      document.getElementsByClassName('rain-bar-amount')[i].style.width = snow[i] + "mm";
      document.getElementsByClassName('millimeters')[i].innerHTML = snow[i] + "mm";
      document.getElementsByClassName('rainSnow')[i].innerHTML = "Snow: " + snow[i] + "mm";
    }

  };
};

// Outputs location and gives coordinate attributes to weather request. Alternate method.
function requestLocation() {
  document.getElementById('location').innerHTML = city + ", " + country;
  document.getElementById('region').innerHTML = region;

  xmlhttp = new XMLHttpRequest();
  url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=dd466cfbfd2578f87edf06abc3100c1a";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  requestWeather(); // Calls weather after location is added to JSON link.
  console.log(url);
};

// Converts unix time to local date and time.
function timeConversion() {
  for (i = 0; i < 5; i++) {
    var localTime = 0;

    var options = { weekday: 'short', month: 'short', day: 'numeric' };
    localDate = new Date(convertedTime[i] * 1000).toLocaleDateString('en-GB', options);
    localTime = new Date(convertedTime[i] * 1000).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    document.getElementsByClassName('date')[i].innerHTML = localDate;
    document.getElementsByClassName('timeData')[i].innerHTML = localTime;
    console.log(localTime);
  };
};

// Toggles animation classess.
function toggleClass() {
  var toggleClass = document.getElementsByClassName('forecast-container')[0].classList;
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
