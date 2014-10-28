(function() {
  define(['jquery', 'underscore', 'backbone', 'utils', 'text!../templates/sg.html'], function($, _, Backbone, utils, sgTemplate) {
    var SGView;
    SGView = Backbone.View.extend({
      el: $('.b-search'),
      initialize: function(options) {
        this.calendar = options.calendar;
        this.render();
      },
      render: function() {
        this.initHtml();
      },
      events: {
        'keyup .b-search__input': 'keyPress',
        'click .b-search__sg li': 'goToSuggestedCell'
      },
      initHtml: function() {
        this.$searchQ = $('<input />').addClass('b-search__input').attr('placeholder', 'Поиск...').appendTo(this.$el);
        this.$searchSug = $('<ul />').addClass('b-search__sg').appendTo(this.$el);
      },
      keyPress: function(e) {
        var data, index, isWords, query, value;
        query = $(e.currentTarget).val();
        data = this.calendar.data.getData();
        isWords = false;
        this.$searchSug.html('');
        if (query.length > 2) {
          this.$searchSug.show();
          isWords = false;
          for (index in data) {
            value = data[index];
            if (value.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
              this.appendSgItem(value.name, query, index);
              isWords = true;
            } else if (value.descr.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
              this.appendSgItem(value.descr, query, index);
              isWords = true;
            }
          }
          if (!isWords) {
            this.hideSG();
          }
        } else {
          this.hideSG();
        }
      },
      goToSuggestedCell: function(e) {
        var dateArray;
        dateArray = $(e.currentTarget).attr('data-date').split('-');
        this.calendar.curDate.setMonth(dateArray[1]);
        this.calendar.curDate.setYear(dateArray[2]);
        this.calendar.fullContainer();
        this.calendar.hideElements({
          hidePopup: true,
          hideSg: true
        });
        this.$searchQ.val('');
      },
      appendSgItem: function(text, query, date) {
        var sgHtml, templateData;
        templateData = {
          replStr: text.replaceAll(query, "<b>" + query + "</b>"),
          date: date,
          day: date.split('-')[0],
          month: utils.monthSklon[date.split('-')[1]]
        };
        sgHtml = _.template(sgTemplate)(templateData);
        this.$searchSug.append(sgHtml);
      },
      hideSG: function() {
        this.$searchSug.html('').hide();
      }
    });
    return SGView;
  });

}).call(this);
