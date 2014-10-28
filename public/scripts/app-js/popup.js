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
        this.$saveBtn = $('.b-popup__btn_save');
        this.$delBtn = $('.b-popup__btn_delete');
        this.$warning = $('.b-popup__warning');
        this.$popup = $('.b-popup');
        this.$description = this.$popup.find('.b-popup__edit_description');
        this.$name = this.$popup.find('.b-popup__edit_name');
        return this.$date = this.$popup.find('.b-popup__date span');
      };

      Popup.prototype.bindHandlers = function() {
        this.$popup.find('.b-popup__close').on('click', (function(_this) {
          return function() {
            _this.hidePopup();
          };
        })(this));
        this.$popup.on('click', (function(_this) {
          return function(e) {
            if ($(e.target).hasClass('b-popup')) {
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
              $(e.currentTarget).parent().removeClass('b-popup__edit_empty');
            }
          };
        })(this));
        this.$popup.on('click', '.b-popup__edit span', (function(_this) {
          return function(e) {
            var text;
            text = $(e.currentTarget).text();
            $(e.currentTarget).parent().addClass('b-popup__edit_empty').find('input, textarea').val(text).focus();
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
        var description, full, name;
        this.date = opt.date;
        full = opt.full;
        description = opt.description;
        name = opt.name;
        $('body').addClass('body-block');
        this.$date.text("" + (this.date.getDate()) + " " + utils.monthSklon[this.date.getMonth()]);
        if (full) {
          this.$description.removeClass('b-popup__edit_empty').find('span').text(description);
          this.$name.removeClass('b-popup__edit_empty').find('span').text(name);
        } else {
          this.$description.add(this.$name).addClass('b-popup__edit_empty').find('span').text('');
          this.clearInputs();
        }
        this.$popup.fadeIn(100);
        this.$warning.removeClass('visible');
      };

      Popup.prototype.hidePopup = function() {
        $('body').removeClass('body-block');
        this.$popup.fadeOut(100);
        this.calendar.setCurTd(null);
      };

      Popup.prototype.clearInputs = function() {
        this.$popup.find('input, textarea').val('');
      };

      return Popup;

    })();
    return Popup;
  });

}).call(this);
