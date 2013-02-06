yepnope({
  load: [
    "scripts/holo-touch.js", "scripts/vendor/zepto.min.js", "scripts/vendor/lawnchair/lawnchair-0.6.1.min.js",
    "scripts/vendor/lawnchair/lawnchair-adapter-indexed-db-0.6.1.js"
  ],
  complete: function() {
      console.log("loaded assets");
  }
});
