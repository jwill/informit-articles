var App = function() {
  var self = this;
  if (window.localStorage['city'] == undefined) {
    window.localStorage['city'] = 'Mountain View';
    window.localStorage['state'] = 'CA';
  }
  this.loadWeather();
  this.getWeather();
  
  $('#btnSettings').click( function(evt){
    self.saveLocation();
  });
};

App.prototype.saveLocation = function() {
  var self = this;
  var modalText = "<header>Set Location</header>" +
  "<label>City Name:</label><input type='text' id='city'></input><br/>" +
  "<label>State/Country Name:</label><input type='text' id='country'></input><br/>" +
  "<button id='cancelBtn'>Cancel</button><button id='okBtn'>OK</button>";
  
  this.modal =  picoModal({
      content: modalText,
      modalStyles: {
          backgroundColor: "#169",
          opacity: 0.75
      },
      closeButton: true
  });
  
  // Setup handlers
  $('#okBtn').click(function(evt){
    // save location to indexeddb
    cityName = $('#city').get(0).value;
    country = $('#country').get(0).value;

    var loc = {city:cityName, state:country};
    window.localStorage['city'] = cityName;
    window.localStorage['state'] = country;

    $('.location').get(0).innerHTML= cityName + ', ' + country;
    self.getWeather();
    self.modal.close();
  });
  
  $('#cancelBtn').click(function(evt){
    self.modal.close();
  });
}

App.prototype.loadWeather = function() {
  if (window.localStorage['city']) {
    var city = window.localStorage['city'];
    var state = window.localStorage['state'];
    $('.location').get(0).innerHTML= city + ', ' + state;
  }
  if (window.localStorage['conditions']) {
    var obj = JSON.parse(window.localStorage['conditions']);
    $('.conditionsText').get(0).innerHTML = obj.conditions;
    $('.conditionsTemp').get(0).innerHTML = obj.temp +" F";
  }
  if (window.localStorage['desc0']) {
    for (var i = 0; i< 4; i++) {
      var obj = JSON.parse(window.localStorage['desc'+i]);
      $('.desc'+i).get(0).innerHTML = "<span><strong>"+obj.title+"</strong></span><br/>"+obj.fcttext+"<br/><br/>";
    }
  }
}

App.prototype.getWeather = function() {
  var self = this;
  var key = "b76d304ba5abe8af";
  var city, state, location, root;
  // load location
  console.log("getWeather");
  if (window.localStorage['city']) {
    var city = window.localStorage['city'];
    var state = window.localStorage['state'];
    location = state + "/" + city + ".json";
    root = "//api.wunderground.com/api/"+key+"/conditions/q/"+location+"?callback=?";
  } else {
    self.saveLocation();
  }
  forecast = "//api.wunderground.com/api/"+key+"/forecast/q/"+location+"?callback=?";
  $.getJSON(forecast, function(result){
    
    var forecasts = result.forecast.txt_forecast.forecastday;
    for (var i = 0; i<4; i++) {
      var fc = forecasts[i];
      $('.desc'+i).get(0).innerHTML = "<span><strong>"+fc.title+"</strong></span><br/>"+fc.fcttext+"<br/><br/>";
      var obj = {title:fc.title, fcttext:fc.fcttext};
      window.localStorage['desc'+i] = JSON.stringify(obj);
    }
  });
  $.getJSON(root, function(result) {
    var current = result.current_observation;
    var temp = current.temp_f;
    var conditions = current.weather;
    var observationLocation = current.observation_location.full;

    $('.location').get(0).innerText = observationLocation;
    $('.conditionsText').get(0).innerHTML = conditions;
    $('.conditionsTemp').get(0).innerHTML = temp +" F";
    // save current values in db
    var obj = {conditions:conditions, temp:temp, timestamp: new Date()};
    window.localStorage['conditions'] = JSON.stringify(obj);
  });
  
  
}

// Load the assets and start app
yepnope({
  load: [
    "scripts/vendor/zepto.min.js",
    "scripts/vendor/picoModal.js"
  ],
  complete: function() {
      console.log("loaded assets");
      window.app = new App();
  }
});
