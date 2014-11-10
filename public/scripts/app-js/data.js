(function() {
  define(['jquery', 'underscore'], function($, _) {
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

      Data.prototype.getSortedData = function() {
        var data, key, value, _ref;
        data = [];
        _ref = this.getData();
        for (key in _ref) {
          value = _ref[key];
          data.push({
            dateKey: key,
            info: value
          });
        }
        return _.sortBy(data, function(item) {
          var date, dateArray;
          date = new Date();
          dateArray = this.parseKeyToArray(item.dateKey);
          date.setDate(dateArray[0]);
          date.setMonth(dateArray[1]);
          date.setFullYear(dateArray[2]);
          return date.getTime();
        }, this);
      };

      Data.prototype.setData = function(options, save) {
        var key;
        key = "" + (options.date.getDate()) + "-" + (options.date.getMonth()) + "-" + (options.date.getFullYear());
        if (save) {
          this.info[key] = {};
          this.info[key].description = options.description;
          this.info[key].name = options.name;
        } else {
          delete this.info[key];
        }
        localStorage['info'] = JSON.stringify(this.info);
      };

      Data.prototype.getMonthData = function(month, year) {
        var data, dataItem, dataKey, dateArray, itemDate, monthDataArray;
        data = this.getData();
        monthDataArray = [];
        for (dataKey in data) {
          dateArray = this.parseKeyToArray(dataKey);
          itemDate = {
            day: dateArray[0],
            month: dateArray[1],
            year: dateArray[2]
          };
          dataItem = data[dataKey];
          if (dataItem && month === itemDate.month && year === itemDate.year) {
            monthDataArray[itemDate.day] = dataItem;
          }
        }
        return monthDataArray;
      };

      Data.prototype.getDayData = function(date) {
        var data, key;
        key = "" + (date.getDate()) + "-" + (date.getMonth()) + "-" + (date.getFullYear());
        data = this.getData();
        return data[key];
      };

      Data.prototype.parseKeyToArray = function(key) {
        return key.split('-').map(function(el) {
          return parseInt(el);
        });
      };

      return Data;

    })();
    return Data;
  });

}).call(this);
