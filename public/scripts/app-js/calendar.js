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
        this.$elem = $('.b-table');
      };

      Calendar.prototype.bindHandlers = function() {
        this.$elem.on('click', '.b-cell', (function(_this) {
          return function(e) {
            var $currentCell, date, options;
            $currentCell = $(e.currentTarget);
            date = new Date(_this.curDate);
            date.setDate($currentCell.attr('data-date'));
            _this.hideElements({
              hideSg: true
            });
            options = {
              date: date,
              full: $currentCell.hasClass('b-cell_full'),
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
        var $table, data, dataItem, dataKey, dateArray, itemDate, monthDataArray, templateData;
        data = this.data.getData();
        monthDataArray = [];
        for (dataKey in data) {
          dateArray = dataKey.split('-').map(function(el) {
            return parseInt(el);
          });
          itemDate = {
            day: dateArray[0],
            month: dateArray[1],
            year: dateArray[2]
          };
          dataItem = data[dataKey];
          if (dataItem && this.curDate.getMonth() === itemDate.month && this.curDate.getFullYear() === itemDate.year) {
            monthDataArray[itemDate.day] = dataItem;
          }
        }
        templateData = {
          weeksInMonth: this.curDate.weeksInMonth(),
          firstDayInMonth: this.curDate.firstDayInMonth(),
          daysInMonth: this.curDate.daysInMonth(),
          monthDataArray: monthDataArray,
          utils: utils
        };
        $table = _.template(tableTemplate)(templateData);
        this.$elem.html($table);
        this.header.setDateText(this.curDate.getMonth(), this.curDate.getFullYear());
      };

      Calendar.prototype.saveItem = function(item) {
        var date, description, name, savedData;
        name = item.name;
        description = item.description;
        date = item.date;
        this.$curTd.attr('data-descr', description).attr('data-name', name).addClass('b-cell_full').find('.name').text(name).siblings('.descr').text(description);
        savedData = {
          day: date.getDate(),
          curDate: date,
          descr: description,
          name: name
        };
        this.data.setData(savedData, true);
        this.popup.clearInputs();
        this.hideElements({
          hidePopup: true
        });
      };

      Calendar.prototype.deleteItem = function(item) {
        var savedData;
        this.$curTd.removeAttr('data-descr').removeAttr('data-name').removeClass('b-cell_full').find('p').text('');
        savedData = {
          day: item.date.getDate(),
          curDate: item.date
        };
        this.data.setData(savedData, false);
        this.popup.clearInputs();
        this.hideElements({
          hidePopup: true
        });
      };

      Calendar.prototype.setCurTd = function($tdElem) {
        this.$curTd = $tdElem;
        this.$elem.find('.b-cell').removeClass('active');
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
