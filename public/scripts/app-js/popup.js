(function() {
  define(['jquery', 'utils'], function($, utils) {
    var Popup;
    Popup = (function() {
      Popup.prototype.date = null;

      function Popup(calendar) {
        this.calendar = calendar;
        this.initHtml();
        this.bindHandlers();
      }

      Popup.prototype.initHtml = function() {
        this.$saveBtn = $('.save');
        this.$delBtn = $('.delete');
        this.$warning = $('.warning');
        this.$popup = $('.cal__popup');
        this.$description = this.$popup.find('.description');
        this.$name = this.$popup.find('.name');
        return this.$date = this.$popup.find('.date span');
      };

      Popup.prototype.bindHandlers = function() {
        this.$popup.find('.close').on('click', (function(_this) {
          return function() {
            _this.hidePopup();
          };
        })(this));
        this.$popup.on('click', (function(_this) {
          return function(e) {
            if ($(e.target).hasClass('cal__popup')) {
              _this.hidePopup();
            }
          };
        })(this));
        $(document).keydown((function(_this) {
          return function(e) {
            if (e.keyCode === 27) {
              _this.hidePopup();
              return false;
            }
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
        this.$saveBtn.on('click', (function(_this) {
          return function() {
            var description, name;
            description = _this.$description.find('span').text();
            name = _this.$name.find('span').text();
            if (description && name) {
              _this.calendar.saveItem({
                name: name,
                description: description,
                date: _this.date
              });
            } else if (!(description || name)) {
              _this.calendar.deleteItem({
                date: _this.date
              });
            } else {
              _this.$warning.addClass('visible');
            }
          };
        })(this));
        this.$delBtn.on('click', (function(_this) {
          return function() {
            _this.calendar.deleteItem({
              date: _this.date
            });
          };
        })(this));
      };

      Popup.prototype.showPopup = function(opt) {
        var description, full, name, newX, newY;
        newX = opt.x;
        newY = opt.y;
        this.date = opt.date;
        full = opt.full;
        description = opt.description;
        name = opt.name;
        $('body').addClass('body-block');
        this.$date.text("" + (this.date.getDate()) + " " + utils.monthSklon[this.date.getMonth()]);
        if (full) {
          this.$description.removeClass('empty').find('span').text(description);
          this.$name.removeClass('empty').find('span').text(name);
        } else {
          this.$description.add(this.$name).addClass('empty').find('span').text('');
          this.$popup.find('input, textarea').val('');
        }
        this.$popup.fadeIn(100);
        this.$warning.removeClass('visible');
      };

      Popup.prototype.hidePopup = function() {
        $('body').removeClass('body-block');
        this.$popup.fadeOut(100);
        this.calendar.setCurTd(null);
      };

      return Popup;

    })();
    return Popup;
  });

}).call(this);
