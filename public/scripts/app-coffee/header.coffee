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
		goToRelativeMonth : (months) ->
			newDate = @calendar.curDate.get('date')
			newDate.setMonth(@calendar.curDate.get('date').getMonth()+months)
			@goToMonth(newDate)
			return
		prevMonth : () ->
			@goToRelativeMonth(-1)
			return
		nextMonth : () ->
			@goToRelativeMonth(1)
			return
		todayMonth : () ->
			newDate = @calendar.curDate.get('date')
			newDate.setMonth(@calendar.today.getMonth())
			newDate.setFullYear(@calendar.today.getFullYear())
			@goToMonth(newDate)
			return
		goToMonth : (newDate) ->
			@calendar.curDate.unset('date',{silent:true})
			@calendar.curDate.set('date',newDate)
			return
		setDateText : (month, year)->
			@$monthElem.text("#{utils.months[month]} #{year}")
			return
	})
	HeaderView


