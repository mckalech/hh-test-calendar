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
      goToRelativeMonth: function(months) {
        var newDate;
        newDate = this.calendar.curDate.get('date');
        newDate.setMonth(this.calendar.curDate.get('date').getMonth() + months);
        this.goToMonth(newDate);
      },
      prevMonth: function() {
        this.goToRelativeMonth(-1);
      },
      nextMonth: function() {
        this.goToRelativeMonth(1);
      },
      todayMonth: function() {
        var newDate;
        newDate = this.calendar.curDate.get('date');
        newDate.setMonth(this.calendar.today.getMonth());
        newDate.setYear(this.calendar.today.getFullYear());
        this.goToMonth(newDate);
      },
      goToMonth: function(newDate) {
        this.calendar.curDate.unset('date', {
          silent: true
        });
        this.calendar.curDate.set('date', newDate);
      },
      setDateText: function(month, year) {
        this.$monthElem.text("" + utils.months[month] + " " + year);
      }
    });
    return HeaderView;
  });

}).call(this);
