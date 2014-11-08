(function() {
  define(['jquery', 'underscore', 'backbone', 'utils', 'header', 'data', 'sg', 'popup', 'text!../templates/table.html'], function($, _, Backbone, utils, HeaderView, Data, SGView, PopupView, tableTemplate) {
    var CalendarView;
    CalendarView = Backbone.View.extend({
      el: $('.b-table'),
      initialize: function(options) {
        this.today = new Date();
        this.curDate = new Backbone.Model({
          date: new Date()
        });
        this.$curTd = null;
        this.data = new Data(this);
        this.header = new HeaderView({
          calendar: this
        });
        this.sg = new SGView({
          calendar: this
        });
        this.popup = new PopupView({
          calendar: this
        });
        this.bindHandlers();
        this.render();
      },
      events: {
        'click .b-cell': 'cellClick'
      },
      render: function() {
        var $table, templateData;
        templateData = {
          weeksInMonth: this.curDate.get('date').weeksInMonth(),
          firstDayInMonth: this.curDate.get('date').firstDayInMonth(),
          daysInMonth: this.curDate.get('date').daysInMonth(),
          monthDataArray: this.data.getMonthData(this.curDate.get('date').getMonth(), this.curDate.get('date').getFullYear()),
          todayDay: this.today.getDate(),
          isTodayMonth: this.curDate.get('date').getMonth() === this.today.getMonth() && this.curDate.get('date').getYear() === this.today.getYear(),
          utils: utils
        };
        $table = _.template(tableTemplate)(templateData);
        this.$el.html($table);
        this.header.setDateText(this.curDate.get('date').getMonth(), this.curDate.get('date').getFullYear());
      },
      cellClick: function(e) {
        var $currentCell, date, itemData;
        $currentCell = $(e.currentTarget);
        date = new Date(this.curDate.get('date'));
        date.setDate($currentCell.attr('data-date'));
        this.hideElements({
          hideSg: true
        });
        itemData = {
          date: date,
          full: $currentCell.hasClass('b-cell_full'),
          description: $currentCell.attr('data-descr'),
          name: $currentCell.attr('data-name')
        };
        this.popup.showPopup(itemData);
        this.setCurTd($currentCell);
      },
      bindHandlers: function() {
        this.curDate.on('change', function(model, value, options) {
          this.hideElements({
            hidePopup: true,
            hideSg: true
          });
          this.render();
        }, this);
      },
      saveItem: function(item) {
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
      },
      deleteItem: function(item) {
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
      },
      setCurTd: function($tdElem) {
        this.$curTd = $tdElem;
        this.$el.find('.b-cell').removeClass('active');
        if (this.$curTd) {
          this.$curTd.addClass('active');
        }
      },
      hideElements: function(options) {
        if (options.hidePopup) {
          this.popup.hidePopup();
        }
        if (options.hideSg) {
          this.sg.hideSG();
        }
      }
    });
    return CalendarView;
  });

}).call(this);
