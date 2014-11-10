(function() {
  define(['jquery', 'underscore', 'backbone', 'utils', 'text!../templates/search.html', 'text!../templates/sg.html'], function($, _, Backbone, utils, searchTemplate, sgTemplate) {
    var SGView;
    SGView = Backbone.View.extend({
      el: $('.b-search'),
      initialize: function(options) {
        this.calendar = options.calendar;
        this.render();
      },
      render: function() {
        var searchHtml;
        searchHtml = _.template(searchTemplate)();
        this.$el.html(searchHtml);
        this.$searchQ = $('.b-search__input');
        this.$searchSug = $('.b-search__sg');
      },
      events: {
        'keyup .b-search__input': 'keyPress',
        'click .b-search__sg li': 'goToSuggestedCell'
      },
      keyPress: function(e) {
        var data, isWords, item, query, _i, _len;
        query = $(e.currentTarget).val();
        isWords = false;
        this.$searchSug.html('');
        if (query.length > 2) {
          data = this.calendar.data.getSortedData();
          this.$searchSug.show();
          isWords = false;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            item = data[_i];
            if (item.info.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
              this.appendSgItem(item.info.name, query, item.dateKey);
              isWords = true;
            } else if (item.info.description.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
              this.appendSgItem(item.info.description, query, item.dateKey);
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
        var dateArray, newDate;
        dateArray = $(e.currentTarget).attr('data-date').split('-');
        newDate = this.calendar.curDate.get('date');
        newDate.setDate(dateArray[0]);
        newDate.setMonth(dateArray[1]);
        newDate.setYear(dateArray[2]);
        this.calendar.curDate.unset('date', {
          silent: true
        });
        this.calendar.curDate.set('date', newDate);
        this.$searchQ.val('');
      },
      appendSgItem: function(text, query, date) {
        var sgHtml, templateData;
        templateData = {
          replStr: text.replaceAll(query, "<b>" + query + "</b>"),
          date: date,
          day: date.split('-')[0],
          month: utils.monthSklon[date.split('-')[1]],
          year: date.split('-')[2]
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
