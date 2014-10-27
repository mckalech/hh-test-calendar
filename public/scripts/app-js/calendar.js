(function() {
  define(['jquery', 'underscore', 'utils', 'header', 'data', 'sg', 'popup', 'text!../templates/table.html'], function($, _, utils, Header, Data, SG, Popup, tableTemplate) {
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
        var $table, d, data, dateMas, key, m, templateData, y;
        data = this.data.getData();
        templateData = {
          weeksInMonth: this.curDate.weeksInMonth(),
          firstDayInMonth: this.curDate.firstDayInMonth(),
          daysInMonth: this.curDate.daysInMonth(),
          utils: utils
        };
        $table = _.template(tableTemplate)(templateData);
        this.$elem.html($table);
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
