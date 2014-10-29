define ['jquery', 'underscore', 'backbone', 'utils', 'text!../templates/header.html'], ($,_, Backbone, utils, headerTemplate) ->
	HeaderView = Backbone.View.extend({
		el : $('.b-header')
		initialize : (options)->
			@calendar = options.calendar	
			@render()
			return
		render : ()->
			headerHtml = _.template(headerTemplate)()
			@$el.html(headerHtml);
			@$monthElem = 	$('.b-header__month')
			return
		events : {
			'click .b-header__nav_prev' : 'prevMonth'
			'click .b-header__nav_next' : 'nextMonth'
			'click .b-header__today-btn' : 'todayMonth'
		}
		prevMonth : () ->
			@calendar.curDate.setMonth(@calendar.curDate.getMonth()-1)
			@goToMonth()
			return
		nextMonth : () ->
			@calendar.curDate.setMonth(@calendar.curDate.getMonth()+1)
			@goToMonth()
			return
		todayMonth : () ->
			@calendar.curDate.setMonth(@calendar.today.getMonth())
			@calendar.curDate.setYear(@calendar.today.getFullYear())
			@goToMonth()
			return
		goToMonth : () ->
			@calendar.hideElements({hidePopup:yes, hideSg:yes})
			@calendar.fullContainer()
			return
		setDateText : (month, year)->
			@$monthElem.text("#{utils.months[month]} #{year}")
			return
	})
	HeaderView


