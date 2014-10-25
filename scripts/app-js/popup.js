(function() {
  define(['jquery'], function($) {
    var Popup;
    Popup = (function() {
      function Popup(calendar) {
        this.calendar = calendar;
        this.initHtml();
        this.bindHandlers();
      }

      Popup.prototype.initHtml = function() {
        this.$saveBtn = $('.save');
        this.$delBtn = $('.delete');
        this.$warning = $('.warning');
        return this.$popup = $('.cal__popup');
      };

      Popup.prototype.bindHandlers = function() {
        this.$popup.find('.close').on('click', (function(_this) {
          return function() {
            _this.hidePopup();
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
            description = _this.$popup.find('.description').find('span').text();
            name = _this.$popup.find('.name').find('span').text();
            if (description && name) {
              _this.calendar.saveItem();
            } else if (!(description || name)) {
              _this.calendar.deleteItem();
            } else {
              _this.$warning.addClass('visible');
            }
          };
        })(this));
        this.$delBtn.on('click', (function(_this) {
          return function() {
            _this.calendar.deleteItem();
          };
        })(this));
      };

      Popup.prototype.showPopup = function(opt) {
        var newX, newY;
        newX = opt.x;
        newY = opt.y;
        this.$popup.css({
          top: newY - 30,
          left: newX + 20
        }).fadeIn(100);
        this.$warning.removeClass('visible');
      };

      Popup.prototype.hidePopup = function() {
        this.$popup.fadeOut(100);
        this.calendar.setCurTd(null);
      };

      return Popup;

    })();
    return Popup;
  });

}).call(this);
