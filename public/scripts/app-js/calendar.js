(function() {
  define(['jquery', 'underscore', 'utils', 'header', 'data', 'sg', 'popup', 'text!../templates/table.html'], function($, _, utils, HeaderView, Data, SG, Popup, tableTemplate) {
    var Calendar;
    Calendar = (function() {
      Calendar.prototype.today = new Date();

      Calendar.prototype.curDate = new Date();

      Calendar.prototype.$curTd = null;

      function Calendar() {
        this.initHtml();
        this.data = new Data(this);
        this.header = new HeaderView({
          calendar: this
        });
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
            var $currentCell, date, itemData;
            $currentCell = $(e.currentTarget);
            date = new Date(_this.curDate);
            date.setDate($currentCell.attr('data-date'));
            _this.hideElements({
              hideSg: true
            });
            itemData = {
              date: date,
              full: $currentCell.hasClass('b-cell_full'),
              description: $currentCell.attr('data-descr'),
              name: $currentCell.attr('data-name')
            };
            _this.popup.showPopup(itemData);
            _this.setCurTd($currentCell);
          };
        })(this));
      };

      Calendar.prototype.fullContainer = function() {
        var $table, templateData;
        templateData = {
          weeksInMonth: this.curDate.weeksInMonth(),
          firstDayInMonth: this.curDate.firstDayInMonth(),
          daysInMonth: this.curDate.daysInMonth(),
          monthDataArray: this.data.getMonthData(this.curDate.getMonth(), this.curDate.getFullYear()),
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
          date: date,
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
          date: item.date
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
