(function() {
  define([], function() {
    Date.prototype.daysInMonth = function() {
      return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
    };
    Date.prototype.weeksInMonth = function() {
      var count;
      count = this.daysInMonth() % 7 > 0 || this.firstDayInMonth() !== 0 ? 5 : 4;
      if (this.daysInMonth() % 7 > 7 - this.firstDayInMonth()) {
        count++;
      }
      return count;
    };
    Date.prototype.firstDayInMonth = function() {
      return new Date(this.getFullYear(), this.getMonth(), 1).getNormalDay();
    };
    Date.prototype.getNormalDay = function() {
      if (this.getDay() > 0) {
        return this.getDay() - 1;
      } else {
        return 6;
      }
    };
    String.prototype.replaceAll = function(search, replace) {
      return this.split(search).join(replace);
    };
  });

}).call(this);
