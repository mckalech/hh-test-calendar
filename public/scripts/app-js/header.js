(function() {
  define(['jquery', 'utils'], function($, utils) {
    var Header;
    Header = (function() {
      function Header(calendar) {
        this.calendar = calendar;
        this.initHtml();
        this.bindHandlers();
      }

      Header.prototype.initHtml = function() {
        this.$prevBtn = $('.b-header__nav_prev');
        this.$nextBtn = $('.b-header__nav_next');
        this.$todayBtn = $('.b-header__today-btn');
        return this.$monthElem = $('.b-header__month');
      };

      Header.prototype.bindHandlers = function() {
        this.$prevBtn.on('click', (function(_this) {
          return function() {
            _this.calendar.curDate.setMonth(_this.calendar.curDate.getMonth() - 1);
            _this.goToMonth();
          };
        })(this));
        this.$nextBtn.on('click', (function(_this) {
          return function() {
            _this.calendar.curDate.setMonth(_this.calendar.curDate.getMonth() + 1);
            _this.goToMonth();
          };
        })(this));
        this.$todayBtn.on('click', (function(_this) {
          return function() {
            _this.calendar.curDate.setMonth(_this.calendar.today.getMonth());
            _this.calendar.curDate.setYear(_this.calendar.today.getFullYear());
            _this.goToMonth();
          };
        })(this));
      };

      Header.prototype.goToMonth = function() {
        this.calendar.hideElements({
          hidePopup: true,
          hideSg: true
        });
        this.calendar.fullContainer();
      };

      Header.prototype.setDateText = function(month, year) {
        this.$monthElem.text("" + utils.months[month] + " " + year);
      };

      return Header;

    })();
    return Header;
  });

}).call(this);
