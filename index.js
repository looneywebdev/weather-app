let userInput = '';

//function once location has been identified
function success(position) {
    console.log('successful');
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    userInput = `${lat},${long}`;
    $('.buttons').removeClass('hidden');
    callApi(userInput, displayCurrent);
    console.log(userInput);
}

//individual click event listening functions
function handleForecast() {
    console.log("Listening for click on Forecast");
    $('.forecast').on('click', function (ev){   
        ev.preventDefault();
        callForecastApi(userInput, displayForecast);
    });
}

function handleSunrise() {
    console.log("Listening for click on Sunrise");
    $('.sunrise').on('click', function(ev) {
        ev.preventDefault();
        callSunsetApi(userInput, displaySunrise);
    });
}

function handleAlmanac() {
    console.log("Listening for click on Almanac");
    $('.almanac').on('click', function(ev){
        ev.preventDefault();
        callAlmanacApi(userInput, displayAlmanac);
    });
}

function handleCurrent() {
    console.log("Listening for click on Current");
    $('.current').on('click', function(ev){
        ev.preventDefault();
        callCurrentApi(userInput, displayCurrent);
    });
}

function handleFindMe() {
    console.log("Listening for click on Find Me");
    $('.find-me').on('click', function(ev) {
        ev.preventDefault();
        getLocation();
    });
  }

// //function if an error is identified
function error() {
console.log('Submit manual zipzode.');
}

//function for current conditions given userInput
function callApi(userInput, callback) {
    const settings =  {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/conditions/q/${userInput}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

function  displayWeatherData(result){
    $('.city-name').html(`<h2 class='city'>${result.current_observation.display_location.full}</h2>`);

    $('.js-search-results')
    .html(`
    <img class="picture" src="${result.current_observation.icon_url}">
    <p>Current Temperature: ${result.current_observation.temperature_string}</p>
    <p>The relative humidity is: ${result.current_observation.relative_humidity}</p>
    <p>Wind: ${result.current_observation.wind_string}</p>`
    );
}



//function to display current conditions and then load buttons for the rest of the user experience
//display
function displayCurrent(result) {
    const {
        display_location,
        icon_url,
        temperature_string,
        relative_humidity,
        wind_string
    } = result.current_observation;
    
    let newUrl = icon_url.replace(/http/i, 'https');
    console.log(newUrl);

    $('.city-name').html(`<h2 class="city-name">${display_location.full}</h2>`);

    $('.js-search-results')
        .html(`
        <img src="${newUrl}">
        <p>Current Temperature: ${temperature_string}</p>
        <p>The relative humidity is: ${relative_humidity}</p>
        <p>Wind: ${wind_string}</p>`
    );
}

//function that renders result content structure
//printing image unsecurely
function renderResult(result) {
    let newUrl = result.icon_url.replace(/http/i, 'https');
    console.log(newUrl);
    return `<div class="forecast-data">
        <h3>${result.title}</h3>
        <img src="${newUrl}" alt="result icon">
        <p>${result.fcttext}</p>
      </div>`;
}

//function that displays data in html to the end user
function displayForecast(result) {
    const results = result.forecast.txt_forecast.forecastday.map(renderResult);
    $('.js-search-results').html(results);
}

function displayAlmanac(result) {
    $('.js-search-results')
    .html(`<section class="almanac-data">
    <div class="high">
    <p><span class="record-high">${result.almanac.temp_high.record.F} F</span>
    <p><span class="year">${result.almanac.temp_high.recordyear}</p>
    </div>
    <div class="low">
    <p><span class="record-low">${result.almanac.temp_low.record.F} F</span></p>
    <p><span class="year">${result.almanac.temp_low.recordyear}</span></p>
    </div>
    </section>`
    );
}

function displaySunrise(result) {
    $('.js-search-results')
    .html(`
    <section class="sunrise-sunset">
    <div class= "rise"><img class="sun" src="sunrise.png" alt="sunrise icon"><p span class="sunrise-time">${result.sun_phase.sunrise.hour}:${result.sun_phase.sunrise.minute}</span></p></div>
    <div class= "set"><img class="sun" src="sunset.png" alt="sunset icon"><p span class="sunset-time">${result.sun_phase.sunset.hour}:${result.sun_phase.sunset.minute}</span></p></div>
    </section>`
    );
}

//functions that send GET request to wunderground API

function callSunsetApi(userInput, callback) {
    const settings =  {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/astronomy/q/${userInput}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

function callForecastApi(userInput, callback) {
    const settings =  {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/forecast/q/${userInput}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

function callAlmanacApi(userInput, callback) {
    const settings = {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/almanac/q/${userInput}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

function callCurrentApi(userInput, callback) {
    const settings =  {
        url: `https://api.wunderground.com/api/5f1b6d8103e5bf4c/conditions/q/${userInput}.json`,
        dataType: "jsonp",
        success: callback
    };
    $.ajax(settings);
}

function callZipApi(userInput, callback) {
    const settings =  {
        url : `https://api.wunderground.com/api/5f1b6d8103e5bf4c/geolookup/conditions/q/${userInput}.json`,
        dataType : "jsonp",
        success: callback
        };
        $.ajax(settings);
}

//function that gets location using geolocation api
function getLocation() {
    return navigator.geolocation.getCurrentPosition(success, error);
  }

//function that listens to manual input
function searchFormSubmit() {
    $('.js-form').submit(ev => {
        ev.preventDefault();
        const queryTarget = $(ev.currentTarget).find('#zipcode');
        const query = queryTarget.val();
        queryTarget.val('');
        userInput = `${query}`;
        console.log(userInput);
        $('.buttons').removeClass('hidden');
        callZipApi(userInput, displayWeatherData);
    });
  }

$(document).ready(function (){
    searchFormSubmit();
    handleFindMe();  
    handleForecast();
    handleSunrise();
    handleAlmanac();
    handleCurrent();
  });
