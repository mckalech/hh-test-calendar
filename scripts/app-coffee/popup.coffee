define ['jquery'], ($) ->
	class Popup 
		constructor: (calendar) ->
			@calendar = calendar
			@initHtml()
			@bindHandlers()
		initHtml : () ->
			@$saveBtn 	= 	$('.save')
			@$delBtn 	= 	$('.delete')
			@$warning 	= 	$('.warning')
			@$popup 	= 	$('.cal__popup')
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
				description = @$popup.find('.description').find('span').text()
				name = @$popup.find('.name').find('span').text()
				if description and name	
					@calendar.saveItem()
				else unless description or name	
					@calendar.deleteItem()
				else
					@$warning.addClass('visible')
				return		

			@$delBtn.on 'click', ()=>
				@calendar.deleteItem()
				return

			return
			
		showPopup: (opt) ->
			newX = opt.x
			newY = opt.y
			@$popup.css({ top: newY-30, left: newX+20}).fadeIn(100)
			@$warning.removeClass('visible')
			return
		
		hidePopup:() ->
			@$popup.fadeOut(100)
			@calendar.setCurTd(null)
			return
	return Popup


