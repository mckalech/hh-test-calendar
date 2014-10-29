(function() {
  define(['jquery', 'underscore', 'backbone', 'utils'], function($, _, Backbone, utils) {
    var PopupView;
    PopupView = Backbone.View.extend({
      el: $('.b-popup'),
      date: null,
      initialize: function(options) {
        this.calendar = options.calendar;
        this.render();
        this.bindHandlers();
      },
      render: function() {
        this.$warning = this.$('.b-popup__warning');
        this.$description = this.$('.b-popup__edit_description');
        this.$name = this.$('.b-popup__edit_name');
        this.$date = this.$('.b-popup__date span');
      },
      events: {
        'click': 'overlayClick',
        'click .b-popup__close': 'closeClick',
        'blur input, textarea': 'inputsBlur',
        'click .b-popup__edit span': 'inputSpansClick',
        'click .b-popup__btn_save': 'saveClick',
        'click .b-popup__btn_delete': 'deleteClick'
      },
      closeClick: function() {
        this.hidePopup();
      },
      overlayClick: function(e) {
        if ($(e.target).hasClass('b-popup')) {
          this.hidePopup();
        }
      },
      inputsBlur: function(e) {
        var text;
        text = $(e.currentTarget).val();
        $(e.currentTarget).siblings('span').text(text);
        if (text) {
          $(e.currentTarget).parent().removeClass('b-popup__edit_empty');
        }
      },
      inputSpansClick: function(e) {
        var text;
        text = $(e.currentTarget).text();
        $(e.currentTarget).parent().addClass('b-popup__edit_empty').find('input, textarea').val(text).focus();
      },
      saveClick: function() {
        var description, name;
        description = this.$description.find('span').text();
        name = this.$name.find('span').text();
        if (description && name) {
          this.calendar.saveItem({
            name: name,
            description: description,
            date: this.date
          });
        } else if (!(description || name)) {
          this.calendar.deleteItem({
            date: this.date
          });
        } else {
          this.$warning.addClass('visible');
        }
      },
      deleteClick: function() {
        this.calendar.deleteItem({
          date: this.date
        });
      },
      bindHandlers: function() {
        $(document).keydown((function(_this) {
          return function(e) {
            if (e.keyCode === 27) {
              _this.hidePopup();
              return false;
            }
          };
        })(this));
      },
      showPopup: function(itemData) {
        var description, full, name;
        this.date = itemData.date;
        full = itemData.full;
        description = itemData.description;
        name = itemData.name;
        $('body').addClass('body-block');
        this.$date.text("" + (this.date.getDate()) + " " + utils.monthSklon[this.date.getMonth()]);
        if (full) {
          this.$description.removeClass('b-popup__edit_empty').find('span').text(description);
          this.$name.removeClass('b-popup__edit_empty').find('span').text(name);
        } else {
          this.$description.add(this.$name).addClass('b-popup__edit_empty').find('span').text('');
          this.clearInputs();
        }
        this.$el.fadeIn(100);
        this.$warning.removeClass('visible');
      },
      hidePopup: function() {
        $('body').removeClass('body-block');
        this.$el.fadeOut(100);
        this.calendar.setCurTd(null);
      },
      clearInputs: function() {
        this.$el.find('input, textarea').val('');
      }
    });
    return PopupView;
  });

}).call(this);
