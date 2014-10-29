(function() {
  define(['jquery', 'underscore', 'backbone', 'utils', 'text!../templates/header.html'], function($, _, Backbone, utils, headerTemplate) {
    var HeaderView;
    HeaderView = Backbone.View.extend({
      el: $('.b-header'),
      initialize: function(options) {
        this.calendar = options.calendar;
        this.render();
      },
      render: function() {
        var headerHtml;
        headerHtml = _.template(headerTemplate)();
        this.$el.html(headerHtml);
        this.$monthElem = $('.b-header__month');
      },
      events: {
        'click .b-header__nav_prev': 'prevMonth',
        'click .b-header__nav_next': 'nextMonth',
        'click .b-header__today-btn': 'todayMonth'
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
