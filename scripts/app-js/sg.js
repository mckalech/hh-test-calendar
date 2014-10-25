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
        this.$searchQ.bind('keyup', (function(_this) {
          return function(e) {
            var data, index, isWords, query, replStr, value;
            query = $(e.currentTarget).val();
            data = _this.calendar.data.getData();
            isWords = false;
            _this.$searchSug.html('');
            if (query.length > 2) {
              _this.$searchSug.show();
              isWords = false;
              for (index in data) {
                value = data[index];
                if (value.descr.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                  replStr = value.descr.replaceAll(query, "<b>" + query + "</b>");
                  _this.$searchSug.append("<li data-date='" + index + "'><p>" + replStr + "</p><span>" + (index.split('-')[0]) + " " + utils.monthSklon[index.split('-')[1]] + "</span></li");
                  isWords = true;
                } else if (value.name.indexOf(query) >= 0) {
                  replStr = value.name.replaceAll(query, "<b>" + query + "</b>");
                  _this.$searchSug.append("<li data-date='" + index + "'><p>" + replStr + "</p><span>" + (index.split('-')[0]) + " " + utils.monthSklon[index.split('-')[1]] + "</span></li");
                  isWords = true;
                }
              }
              if (!isWords) {
                _this.$searchSug.hide();
              }
            } else {
              _this.$searchSug.hide();
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
            _this.$searchSug.html('').hide();
            _this.$searchQ.val('');
          };
        })(this));
      };

      return SG;

    })();
    return SG;
  });

}).call(this);
