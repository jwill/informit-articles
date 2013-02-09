var Install = function () {
  this.events = {};

  this.state = 'unknown';

  return this;
};

Install.prototype.update = function() {
  var btn = $('#install-btn')
  if(this.state == 'uninstalled') {
    btn.get(0).style.display = 'block';
  }
  else if(this.state == 'installed' || this.state == 'unsupported') {
    btn.get(0).style.display = 'none';
  }
};

Install.prototype.init = function() {
  var btn = $('#install-btn');
  var self = this;

  btn.click(function(){
    self.install();
  });

  this.on('change', this.update);
  this.on('error', function(e, err) {
    alert('There was an error during installation.');
  });
};

Install.prototype.install = function() {
  console.log('here');
  var fn = this[this.type + 'Install'];
  console.log(fn);
  
  if (fn) {
      fn();
  } else {
      this.trigger('error', 'unsupported install: ' + this.type);
  }
};

Install.prototype.check = function() {
  var apps = navigator.mozApps, request;
  var self = this;

  if (navigator.mozApps) {
    self.type = 'mozilla';
    request = navigator.mozApps.getSelf();
    request.onsuccess = function() {
      if (self.result) {
        self.triggerChange('installed');
      } else {
        self.triggerChange('uninstalled');
      }
    };

    request.onerror = function (err) {
      self.error = err;
      sef.triggerChange('error');
    }
  } else {
    self.type = 'unsupported';
    self.triggerChange('unsupported');
  }
};

Install.prototype.triggerChange = function(state) {
  this.state = state;
  this.trigger('change', this.state);
};

Install.prototype.mozillaInstall = function() {

   /* Mozilla/Firefox installation */
  var mozillaInstallUrl = location.href + 'manifest.webapp';

  var installRequest = navigator.mozApps.install(mozillaInstallUrl);
  installRequest.onsuccess = function(data) {
    install.triggerChange('installed');
    window.location = 'app.html';
  };

  installRequest.onerror = function(err) {
    install.error = err;
    install.triggerChange('error');
  };
};

Install.prototype.on = function(name, func) {
  this.events[name] = (this.events[name] || []).concat([func]);
};

Install.prototype.off = function(name, func) {
  if(this.events[name]) {
      var res = [];

      for(var i=0, l=this.events[name].length; i<l; i++) {
          var f = this.events[name][i];
          if(f != func) {
              res.push();
          }
      }
      this.events[name] = res;
  }
};

Install.prototype.trigger = function(name) {
  var args = Array.prototype.slice.call(arguments, 1);

  if(this.events[name]) {
      for(var i=0, l=this.events[name].length; i<l; i++) {
          this.events[name][i].apply(this, args);
      }
  }
};

$().ready(function() {
  window.install = new Install();
  window.install.init();
  window.install.check();
});
