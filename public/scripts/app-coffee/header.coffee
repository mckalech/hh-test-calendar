define ['jquery', 'utils'], ($, utils) ->
	class Header 
		constructor: (calendar) ->
			@calendar = calendar
			@initHtml()
			@bindHandlers()
		initHtml : () ->
			@$prevBtn 	= 	$('.b-header__nav_prev')
			@$nextBtn 	= 	$('.b-header__nav_next')
			@$todayBtn 	= 	$('.b-header__today-btn')
			@$monthElem = 	$('.b-header__month')
		bindHandlers : () ->
			@$prevBtn.on 'click', () =>
				@calendar.curDate.setMonth(@calendar.curDate.getMonth()-1)
				@goToMonth()
				return

			@$nextBtn.on 'click', () =>
				@calendar.curDate.setMonth(@calendar.curDate.getMonth()+1)
				@goToMonth()
				return

			@$todayBtn.on 'click', () =>
				@calendar.curDate.setMonth(@calendar.today.getMonth())
				@calendar.curDate.setYear(@calendar.today.getFullYear())
				@goToMonth()
				return
			return
		goToMonth : () ->
			@calendar.hideElements({hidePopup:yes, hideSg:yes})
			@calendar.fullContainer()
			return
		setDateText : (month, year)->
			@$monthElem.text("#{utils.months[month]} #{year}")
			return



	return Header


