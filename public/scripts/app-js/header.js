(function() {
  define(['jquery', 'underscore', 'backbone', 'utils'], function($, _, Backbone, utils) {
    var HeaderView;
    HeaderView = Backbone.View.extend({
      el: $('.b-header'),
      initialize: function(options) {
        this.calendar = options.calendar;
        this.render();
      },
      render: function() {
        this.initHtml();
      },
      events: {
        'click .b-header__nav_prev': 'prevMonth',
        'click .b-header__nav_next': 'nextMonth',
        'click .b-header__today-btn': 'todayMonth'
      },
      initHtml: function() {
        this.wrapper = this.$('.b-wrap');
        this.$prevBtn = $('<span />').addClass('b-header__nav b-header__nav_prev').appendTo(this.wrapper);
        this.$monthElem = $('<span />').addClass('b-header__month').appendTo(this.wrapper);
        this.$nextBtn = $('<span />').addClass('b-header__nav b-header__nav_next').appendTo(this.wrapper);
        this.$todayBtn = $('<span />').addClass('b-header__today-btn').text('Сегодня').appendTo(this.wrapper);
      },
      prevMonth: function() {
        this.calendar.curDate.setMonth(this.calendar.curDate.getMonth() - 1);
        this.goToMonth();
      },
      nextMonth: function() {
        this.calendar.curDate.setMonth(this.calendar.curDate.getMonth() + 1);
        this.goToMonth();
      },
      todayMonth: function() {
        this.calendar.curDate.setMonth(this.calendar.today.getMonth());
        this.calendar.curDate.setYear(this.calendar.today.getFullYear());
        this.goToMonth();
      },
      goToMonth: function() {
        this.calendar.hideElements({
          hidePopup: true,
          hideSg: true
        });
        this.calendar.fullContainer();
      },
      setDateText: function(month, year) {
        this.$monthElem.text("" + utils.months[month] + " " + year);
      }
    });
    return HeaderView;
  });

}).call(this);
