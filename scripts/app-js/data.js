(function() {
  define(['jquery'], function($) {
    var Data;
    Data = (function() {
      Data.prototype.info = {};

      function Data(calendar) {
        this.calendar = calendar;
      }

      Data.prototype.fullInfo = function() {
        if (localStorage['info']) {
          this.info = JSON.parse(localStorage['info']);
        }
      };

      Data.prototype.saveInfo = function(save) {
        var date, key;
        date = this.calendar.$curTd.attr('data-date');
        key = "" + date + "-" + (this.calendar.curDate.getMonth()) + "-" + (this.calendar.curDate.getFullYear());
        if (save) {
          this.info[key] = {};
          this.info[key].descr = this.calendar.$curTd.attr('data-descr');
          this.info[key].name = this.calendar.$curTd.attr('data-name');
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
