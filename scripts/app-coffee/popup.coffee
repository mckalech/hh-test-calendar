define ['jquery', 'utils'], ($, utils) ->
	class Popup 
		date : null
		constructor: (calendar) ->
			@calendar = calendar
			@initHtml()
			@bindHandlers()
		initHtml : () ->
			@$saveBtn 		= 	$('.save')
			@$delBtn 		= 	$('.delete')
			@$warning 		= 	$('.warning')
			@$popup 		= 	$('.cal__popup')
			@$description 	= 	@$popup.find('.description')
			@$name 			= 	@$popup.find('.name')
			@$date 			= 	@$popup.find('.date span')
		bindHandlers : () ->
			@$popup.find('.close').on 'click', () =>
				@hidePopup()
				return
			
			@$popup.find('input, textarea').on 'blur', (e)=>			
				text = $(e.currentTarget).val()
				$(e.currentTarget).siblings('span').text(text) 
				if text then $(e.currentTarget).parent().removeClass('empty')
				return

			@$popup.on 'click', '.edit span', (e)=>
				text = $(e.currentTarget).text()
				$(e.currentTarget).parent().addClass('empty').find('input, textarea').val(text).focus()
				return

			@$saveBtn.on 'click', ()=>
				description = @$description.find('span').text()
				name = @$name.find('span').text()
				if description and name	
					@calendar.saveItem({
						name : name
						description : description
						date : @date
					})
				else unless description or name	
					@calendar.deleteItem({date : @date})
				else
					@$warning.addClass('visible')
				return		

			@$delBtn.on 'click', ()=>
				@calendar.deleteItem({date : @date})
				return

			return
			
		showPopup: (opt) ->
			newX = opt.x
			newY = opt.y
			@date = opt.date
			full = opt.full
			description = opt.description
			name = opt.name


			@$date.text("#{@date.getDate()} #{utils.monthSklon[@date.getMonth()]}")	
			if full			
				@$description.removeClass('empty').find('span').text(description)
				@$name.removeClass('empty').find('span').text(name)
			else
				@$description.add(@$name).addClass('empty').find('span').text('')
				@$popup.find('input, textarea').val('')
			@$popup.css({ top: newY-30, left: newX+20}).fadeIn(100)
			@$warning.removeClass('visible')
			return
		
		hidePopup:() ->
			@$popup.fadeOut(100)
			@calendar.setCurTd(null)

			return
	return Popup


