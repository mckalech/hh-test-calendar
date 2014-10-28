define ['jquery', 'underscore', 'backbone', 'utils'], ($,_, Backbone, utils) ->
	HeaderView = Backbone.View.extend({
		el : $('.b-header')
		initialize : (options)->
			@calendar = options.calendar	
			@render()
			return
		render : ()->
			@initHtml()
			return
		events : {
			'click .b-header__nav_prev' : 'prevMonth'
			'click .b-header__nav_next' : 'nextMonth'
			'click .b-header__today-btn' : 'todayMonth'
		}
		initHtml : () ->
			@wrapper = @$('.b-wrap')
			@$prevBtn 	= 	$('<span />').addClass('b-header__nav b-header__nav_prev').appendTo(@wrapper)
			@$monthElem = 	$('<span />').addClass('b-header__month').appendTo(@wrapper)
			@$nextBtn 	= 	$('<span />').addClass('b-header__nav b-header__nav_next').appendTo(@wrapper)
			@$todayBtn 	= 	$('<span />').addClass('b-header__today-btn').text('Сегодня').appendTo(@wrapper)
			return
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


