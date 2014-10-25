(function() {
  define(['jquery'], function($) {
    var Data;
    Data = (function() {
      Data.prototype.info = {};

      function Data(calendar) {
        if (localStorage['info']) {
          this.info = JSON.parse(localStorage['info']);
        }
        this.calendar = calendar;
      }

      Data.prototype.getData = function() {
        return this.info;
      };

      Data.prototype.setData = function(options, save) {
        var key;
        key = "" + options.day + "-" + (options.curDate.getMonth()) + "-" + (options.curDate.getFullYear());
        if (save) {
          this.info[key] = {};
          this.info[key].descr = options.descr;
          this.info[key].name = options.name;
        } else {
          delete this.info[key];
        }
        localStorage['info'] = JSON.stringify(this.info);
      };

      return Data;

    })();
    return Data;
  });

}).call(this);
