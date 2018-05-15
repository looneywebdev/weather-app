//function once location has been identified
function success(position) {
    console.log('successful');
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    callApi(lat, long, displayCurrent);
    callSunsetApi(lat, long, initialSunset);
    buttonClicks(lat,long);
}

//function to house all click event listeners
function buttonClicks(lat, long) {
    handleForecast(lat, long);
    handleSunrise(lat, long);
    handleAlmanac(lat, long);
    handleCurrent(lat, long);
}

//individual click event functions
function handleForecast(lat, long) {
    console.log("Listening for click on Forecast");
    $('.forecast').on('click', function (ev){   
        ev.preventDefault();
        callForecastApi(lat,long, displayForecast);
    });
}

function handleSunrise(lat, long) {
    console.log("Listening for click on Sunrise");
    $('.sunrise').on('click', function(ev) {
        ev.preventDefault();
        callSunsetApi(lat, long, displaySunrise);
    });
}

function handleAlmanac(lat, long) {
    console.log("Listening for click on Almanac");
    $('.almanac').on('click', function(ev){
        ev.preventDefault();
        callAlmanacApi(lat, long, displayAlmanac);
    });
}

function handleCurrent(lat, long) {
    console.log("Listening for click on Current");
    $('.current').on('click', function(ev){
        ev.preventDefault();
        callCurrentApi(lat, long, displayCurrent);
    });
}

//function if an error is identified
function error(position) {
      console.log('refresh browser and allow it to see your location');
}

//function for current conditions given lat, long
function callApi(latitude, longitude, callback) {
    const settings =  {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/conditions/q/${latitude},${longitude}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

//function to set background image to either day sky or night sky depending on whether the current time is before or after the sunset time
function initialSunset(results) {
    const sunsetTime = `${results.sun_phase.sunset.hour}:${results.sun_phase.sunset.minute}`;
    
    const nowTime = moment(Date.now()).format('HH:mm');
    //
    const isDay = moment(sunsetTime, 'HH:mm').isAfter(moment(nowTime, 'HH:mm'));
    if (isDay) {
        $('body').addClass('day');
    } else {
        $('body').addClass('night');
    }
}

//function to display current conditions and then load buttons for the rest of the user experience
function displayCurrent(result) {
    $('.city').html(`<h2 class="city-name">${result.current_observation.display_location.full}</h2>`);
    $('.city').append(`<img src="${result.current_observation.icon_url}">`);
    $('.city').append(`<p>Current Temperature: ${result.current_observation.temperature_string}</p>`);
    $('.city').append(`<p>The relative humidity is: ${result.current_observation.relative_humidity}</p>`);
    $('.city').append(`<p>Wind: ${result.current_observation.wind_string}</p>`);
    getStarted();
}

//function that renders result content structure
function renderResult(result) {
    return `<div class="forecast-data">
        <h3>${result.title}</h3>
        <img src="${result.icon_url}" alt="result icon">
        <p>${result.fcttext}</p>
      </div>`;
}

//fuction that presents buttons and instructions for seeing more data for current location

function getStarted() {
    $('.buttons').toggleClass("hidden");
    $('.js-search-results').html(`<p>Click a button above to get awesome weather data!</p>`);
}

//function that displays data in html to the end user
function displayForecast(result) {
    const results = result.forecast.txt_forecast.forecastday.map(renderResult);
    $('.js-search-results').html(results);
}

function displayAlmanac(result) {
    $('.js-search-results').html(`<p>Record High: ${result.almanac.temp_high.record.F} degrees F in ${result.almanac.temp_high.recordyear}</p>`);
    $('.js-search-results').append(`<p>Record Low: ${result.almanac.temp_low.record.F} degrees F in ${result.almanac.temp_low.recordyear}</p>`);
}

function displaySunrise(result) {
    $('.js-search-results').html(`<p>Sunrise Time: ${result.sun_phase.sunrise.hour}:${result.sun_phase.sunrise.minute}</p>`);
    $('.js-search-results').append(`<p>Sunset Time: ${result.sun_phase.sunset.hour}:${result.sun_phase.sunset.minute}</p>`);
}

//functions that send GET request to wunderground API
function callForecastApi(latitude, longitude, callback) {
    const settings =  {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/forecast/q/${latitude},${longitude}.json`,
        dataType: "jsonp",
        success: callback
        };
        $.ajax(settings);
}

function callSunsetApi(latitude, longitude, callback) {
    const settings = {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/astronomy/q/${latitude},${longitude}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

function callAlmanacApi(latitude, longitude, callback) {
    const settings = {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/almanac/q/${latitude},${longitude}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

function callCurrentApi(latitude, longitude, callback) {
    const settings =  {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/conditions/q/${latitude},${longitude}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

//function that gets location using geolocation api
function getLocation() {
  navigator.geolocation.getCurrentPosition(success, error);
}

getLocation();
