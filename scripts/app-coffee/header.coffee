define ['jquery', 'utils'], ($, utils) ->
	class Header 
		constructor: (calendar) ->
			@calendar = calendar
			@initHtml()
			@bindHandlers()
		initHtml : () ->
			@$prevBtn 	= 	$('.prev')
			@$nextBtn 	= 	$('.next')
			@$todayBtn 	= 	$('.today-btn')
			@$monthElem = 	$('.month')
		bindHandlers : () ->
			@$prevBtn.on 'click', () =>
				@calendar.prevMonth()
				@calendar.hidePopup()
				@calendar.fullContainer()
				return

			@$nextBtn.on 'click', () =>
				@calendar.nextMonth()
				@calendar.hidePopup()
				@calendar.fullContainer()
				return

			@$todayBtn.on 'click', () =>
				@calendar.curDate.setMonth(@calendar.today.getMonth())
				@calendar.curDate.setYear(@calendar.today.getFullYear())
				@calendar.hidePopup()
				@calendar.fullContainer()
				return
			return


	return Header


