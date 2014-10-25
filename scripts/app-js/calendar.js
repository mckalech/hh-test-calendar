(function() {
  define(['jquery', 'utils', 'header', 'data'], function($, utils, Header, Data) {
    var Calendar;
    Calendar = (function() {
      Calendar.prototype.today = new Date();

      Calendar.prototype.curDate = new Date();

      Calendar.prototype.$td = null;

      Calendar.prototype.$curTd = null;

      function Calendar() {
        this.initHtml();
        this.data = new Data(this);
        this.header = new Header(this);
        this.fullContainer();
        this.bindHandlers();
      }

      Calendar.prototype.initHtml = function() {
        this.$saveBtn = $('.save');
        this.$delBtn = $('.delete');
        this.$searchQ = $('.search');
        this.$searchSug = $('.sug');
        this.$warning = $('.warning');
        this.$popup = $('.cal__popup');
        this.$elem = $('.container');
      };

      Calendar.prototype.bindHandlers = function() {
        this.$searchQ.bind('keyup', (function(_this) {
          return function(e) {
            var data, index, isWords, query, replStr, value;
            query = $(e.currentTarget).val();
            data = _this.data.getData();
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
            dateMas = $(e.currentTarget).attr('data-date').split('-');
            _this.curDate.setMonth(dateMas[1]);
            _this.curDate.setYear(dateMas[2]);
            _this.fullContainer();
            _this.$searchSug.html('').hide();
            _this.$searchQ.val('');
          };
        })(this));
        this.$popup.find('.close').on('click', (function(_this) {
          return function() {
            _this.hidePopup();
          };
        })(this));
        this.$popup.find('input, textarea').on('blur', (function(_this) {
          return function(e) {
            var text;
            text = $(e.currentTarget).val();
            $(e.currentTarget).siblings('span').text(text);
            if (text) {
              $(e.currentTarget).parent().removeClass('empty');
            }
          };
        })(this));
        this.$popup.on('click', '.edit span', (function(_this) {
          return function(e) {
            var text;
            text = $(e.currentTarget).text();
            $(e.currentTarget).parent().addClass('empty').find('input, textarea').val(text).focus();
          };
        })(this));
        this.$elem.on('click', '.item', (function(_this) {
          return function(e) {
            _this.showPopup({
              x: e.clientX,
              y: e.clientY
            });
            _this.setCurTd($(e.currentTarget));
            _this.$popup.find('.date span').text("" + (_this.$curTd.attr('data-date')) + " " + utils.monthSklon[_this.curDate.getMonth()]);
            if (_this.$curTd.hasClass('full')) {
              _this.$popup.find('.description').removeClass('empty').find('span').text(_this.$curTd.attr('data-descr'));
              _this.$popup.find('.name').removeClass('empty').find('span').text(_this.$curTd.attr('data-name'));
            } else {
              _this.$popup.find('.description, .name').addClass('empty').find('span').text('');
              _this.$popup.find('input, textarea').val('');
            }
          };
        })(this));
        this.$saveBtn.on('click', (function(_this) {
          return function() {
            var description, name;
            description = _this.$popup.find('.description').find('span').text();
            name = _this.$popup.find('.name').find('span').text();
            if (description && name) {
              _this.saveItem();
            } else if (!(description || name)) {
              _this.deleteItem();
            } else {
              _this.$warning.addClass('visible');
            }
          };
        })(this));
        this.$delBtn.on('click', (function(_this) {
          return function() {
            _this.deleteItem();
          };
        })(this));
      };

      Calendar.prototype.prevMonth = function() {
        this.curDate.setMonth(this.curDate.getMonth() - 1);
      };

      Calendar.prototype.nextMonth = function() {
        this.curDate.setMonth(this.curDate.getMonth() + 1);
      };

      Calendar.prototype.fullContainer = function() {
        var d, data, dateMas, dayText, i, j, key, m, newTd, y, _i, _j, _ref;
        d = 1;
        data = this.data.getData();
        this.$elem.html('<table id="main-table" cellpadding=0 cellspacing=0 />');
        for (i = _i = 0, _ref = this.curDate.weeksInMonth(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (i > this.curDate.weeksInMonth()) {
            break;
          }
          this.$elem.find('table').append('<tr />');
          j = 0;
          while (j < this.curDate.firstDayInMonth() && i === 0) {
            this.$elem.find('tr').append("<td><div class='date'>" + utils.days[j] + "</div></td>");
            j++;
          }
          for (j = _j = j; j <= 7 ? _j < 7 : _j > 7; j = j <= 7 ? ++_j : --_j) {
            newTd = $('<td />').appendTo(this.$elem.find('tr').last());
            if (d > this.curDate.daysInMonth()) {
              continue;
            }
            dayText = i === 0 ? "" + utils.days[j] + ", " + d : d;
            newTd.append("<div class='date'>" + dayText + "</div><p class='name'></p><p class='descr'></p>").attr('data-date', d).addClass('item').addClass(d === this.today.getDate() && this.curDate.getMonth() === this.today.getMonth() && this.curDate.getYear() === this.today.getYear() ? 'today' : '');
            d++;
          }
        }
        for (key in data) {
          dateMas = key.split('-').map(function(el) {
            return parseInt(el);
          });
          d = dateMas[0];
          m = dateMas[1];
          y = dateMas[2];
          if (data[key] && this.curDate.getMonth() === m && this.curDate.getFullYear() === y) {
            this.$elem.find("td[data-date='" + d + "']").attr('data-descr', data[key].descr).attr('data-name', data[key].name).addClass('full').find('.name').text(data[key].name).siblings('.descr').text(data[key].descr);
          }
        }
        this.header.$monthElem.text("" + utils.months[this.curDate.getMonth()] + " " + (this.curDate.getFullYear()));
        this.$td = this.$elem.find('.item');
      };

      Calendar.prototype.showPopup = function(opt) {
        var newX, newY;
        newX = opt.x;
        newY = opt.y;
        this.$popup.css({
          top: newY - 30,
          left: newX + 20
        }).fadeIn(100);
        this.$warning.removeClass('visible');
      };

      Calendar.prototype.hidePopup = function() {
        this.$popup.fadeOut(100);
        this.setCurTd(null);
      };

      Calendar.prototype.saveItem = function() {
        var options;
        this.$curTd.attr('data-descr', this.$popup.find('.description').find('span').text()).attr('data-name', this.$popup.find('.name').find('span').text()).addClass('full').find('.name').text(this.$popup.find('.name').find('span').text()).siblings('.descr').text(this.$popup.find('.description').find('span').text());
        options = {
          day: this.$curTd.attr('data-date'),
          curDate: this.curDate,
          descr: this.$curTd.attr('data-descr'),
          name: this.$curTd.attr('data-name')
        };
        this.data.setData(options, true);
        this.$popup.find('input, textarea').val('');
        this.hidePopup();
      };

      Calendar.prototype.deleteItem = function() {
        var options;
        this.$curTd.removeAttr('data-descr').removeAttr('data-name').removeClass('full').find('p').text('');
        options = {
          day: this.$curTd.attr('data-date'),
          curDate: this.curDate
        };
        this.data.setData(options, false);
        this.$popup.find('input, textarea').val('');
        this.hidePopup();
      };

      Calendar.prototype.setCurTd = function($tdElem) {
        this.$curTd = $tdElem;
        this.$td.removeClass('active');
        if (this.$curTd) {
          this.$curTd.addClass('active');
        }
      };

      return Calendar;

    })();
    return Calendar;
  });

}).call(this);
