(function() {
  define(['jquery', 'utils'], function($, utils) {
    var SG;
    SG = (function() {
      function SG(calendar) {
        this.calendar = calendar;
        this.initHtml();
        this.bindHandlers();
      }

      SG.prototype.initHtml = function() {
        this.$searchQ = $('.search');
        return this.$searchSug = $('.sug');
      };

      SG.prototype.bindHandlers = function() {
        this.$searchQ.on('focus', (function(_this) {
          return function(e) {
            _this.calendar.hideElements({
              hidePopup: true
            });
          };
        })(this));
        this.$searchQ.bind('keyup', (function(_this) {
          return function(e) {
            var data, index, isWords, query, value;
            query = $(e.currentTarget).val();
            data = _this.calendar.data.getData();
            isWords = false;
            _this.$searchSug.html('');
            if (query.length > 2) {
              _this.$searchSug.show();
              isWords = false;
              for (index in data) {
                value = data[index];
                if (value.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                  _this.appendSgItem(value.name, query, index);
                  isWords = true;
                } else if (value.descr.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                  _this.appendSgItem(value.descr, query, index);
                  isWords = true;
                }
              }
              if (!isWords) {
                _this.hideSG();
              }
            } else {
              _this.hideSG();
            }
          };
        })(this));
        this.$searchSug.on('click', 'li', (function(_this) {
          return function(e) {
            var dateMas;
            _this.calendar.popup.hidePopup();
            dateMas = $(e.currentTarget).attr('data-date').split('-');
            _this.calendar.curDate.setMonth(dateMas[1]);
            _this.calendar.curDate.setYear(dateMas[2]);
            _this.calendar.fullContainer();
            _this.hideSG();
            _this.$searchQ.val('');
          };
        })(this));
      };

      SG.prototype.appendSgItem = function(text, query, date) {
        var replStr;
        replStr = text.replaceAll(query, "<b>" + query + "</b>");
        this.$searchSug.append("<li data-date='" + date + "'><p>" + replStr + "</p><span>" + (date.split('-')[0]) + " " + utils.monthSklon[date.split('-')[1]] + "</span></li");
      };

      SG.prototype.hideSG = function() {
        return this.$searchSug.html('').hide();
      };

      return SG;

    })();
    return SG;
  });

}).call(this);
