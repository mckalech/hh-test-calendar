(function() {
  define(['jquery', 'utils', 'header', 'data', 'sg', 'popup'], function($, utils, Header, Data, SG, Popup) {
    var Calendar;
    Calendar = (function() {
      Calendar.prototype.today = new Date();

      Calendar.prototype.curDate = new Date();

      Calendar.prototype.$curTd = null;

      function Calendar() {
        this.initHtml();
        this.data = new Data(this);
        this.header = new Header(this);
        this.sg = new SG(this);
        this.popup = new Popup(this);
        this.fullContainer();
        this.bindHandlers();
      }

      Calendar.prototype.initHtml = function() {
        this.$elem = $('.container');
      };

      Calendar.prototype.bindHandlers = function() {
        this.$elem.on('click', '.item', (function(_this) {
          return function(e) {
            var $currentCell, date, options;
            $currentCell = $(e.currentTarget);
            date = new Date(_this.curDate);
            date.setDate($currentCell.attr('data-date'));
            _this.hideElements({
              hideSg: true
            });
            options = {
              x: e.clientX,
              y: e.clientY,
              date: date,
              full: $currentCell.hasClass('full'),
              description: $currentCell.attr('data-descr'),
              name: $currentCell.attr('data-name')
            };
            _this.popup.showPopup(options);
            _this.setCurTd($currentCell);
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
      };

      Calendar.prototype.saveItem = function(options) {
        var date, description, name, opt;
        name = options.name;
        description = options.description;
        date = options.date;
        this.$curTd.attr('data-descr', description).attr('data-name', name).addClass('full').find('.name').text(name).siblings('.descr').text(description);
        opt = {
          day: date.getDate(),
          curDate: date,
          descr: description,
          name: name
        };
        this.data.setData(opt, true);
        this.popup.$popup.find('input, textarea').val('');
        this.hideElements({
          hidePopup: true
        });
      };

      Calendar.prototype.deleteItem = function(options) {
        var opt;
        this.$curTd.removeAttr('data-descr').removeAttr('data-name').removeClass('full').find('p').text('');
        opt = {
          day: options.date.getDate(),
          curDate: options.date
        };
        this.data.setData(opt, false);
        this.popup.$popup.find('input, textarea').val('');
        this.hideElements({
          hidePopup: true
        });
      };

      Calendar.prototype.setCurTd = function($tdElem) {
        this.$curTd = $tdElem;
        this.$elem.find('.item').removeClass('active');
        if (this.$curTd) {
          this.$curTd.addClass('active');
        }
      };

      Calendar.prototype.hideElements = function(options) {
        if (options.hidePopup) {
          this.popup.hidePopup();
        }
        if (options.hideSg) {
          this.sg.hideSG();
        }
      };

      return Calendar;

    })();
    return Calendar;
  });

}).call(this);
