define ['jquery'], ($) ->
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
				@calendar.hideElements({hidePopup:yes, hideSg:yes})
				@calendar.fullContainer()
				return

			@$nextBtn.on 'click', () =>
				@calendar.nextMonth()
				@calendar.hideElements({hidePopup:yes, hideSg:yes})
				@calendar.fullContainer()
				return

			@$todayBtn.on 'click', () =>
				@calendar.curDate.setMonth(@calendar.today.getMonth())
				@calendar.curDate.setYear(@calendar.today.getFullYear())
				@calendar.hideElements({hidePopup:yes, hideSg:yes})
				@calendar.fullContainer()
				return
			return


	return Header


