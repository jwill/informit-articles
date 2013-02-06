var App = function() {
  this.db = Lawnchair({name:'weather'}, function(store) {
    console.log("loaded db");
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
  });
  
  $('#cancelBtn').click(function(evt){
    self.modal.close();
  });
}

App.prototype.getWeather = function() {
  var key = "";
  var city, state, location, root;
  // load location
  this.db.get("location", function(r) {
    if (r != undefined || r != null) {
      city = r.value.city;
      state = r.value.state;
      location = state + "/" + city + ".json";
      root = "//api.wunderground.com/api/"+key+"/conditions/q/"+location+"?callback=?";
    } else {
      // first run and grab location
    }
    forecast = "//api.wunderground.com/api/"+key+"/forecast/q/"+location+"?callback=?";
    $.getJSON(forecast, function(result){
      console.log(result);
      var fc = result.forecast.txt_forecast.forecastday[0];
      // fcttext
      console.log(fc.fcttext);
      $('.desc').get(0).innerText = fc.fcttext;
    });
    $.getJSON(root, function(result) {
      console.log(result);
      var current = result.current_observation;
      var temp = current.temp_f;
      var conditions = current.weather;
      var observationLocation = current.observation_location.full;

      $('.location').get(0).innerText = observationLocation;
      $('.conditionsText').get(0).innerText = conditions;
      $('.conditionsTemp').get(0).innerText = temp +" F";
      // save current values in db
    });
  })
  
  
}


// Load the assets and start app
yepnope({
  load: [
    "scripts/holo-touch.js", "scripts/vendor/zepto.min.js", "scripts/vendor/lawnchair/lawnchair-0.6.1.min.js",
    "scripts/vendor/lawnchair/lawnchair-adapter-indexed-db-0.6.1.js",
    "scripts/vendor/picoModal.js"
  ],
  complete: function() {
      console.log("loaded assets");
      window.app = new App();
  }
});
