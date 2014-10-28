define ['jquery', 'utils'], ($, utils) ->
	class Popup 
		date : null
		constructor: (calendar) ->
			@calendar = calendar
			@initHtml()
			@bindHandlers()
		initHtml : () ->
			@$saveBtn 		= 	$('.b-popup__btn_save')
			@$delBtn 		= 	$('.b-popup__btn_delete')
			@$warning 		= 	$('.b-popup__warning')
			@$popup 		= 	$('.b-popup')
			@$description 	= 	@$popup.find('.b-popup__edit_description')
			@$name 			= 	@$popup.find('.b-popup__edit_name')
			@$date 			= 	@$popup.find('.b-popup__date span')
		bindHandlers : () ->
			@$popup.find('.b-popup__close').on 'click', () =>
				@hidePopup()
				return

			@$popup.on 'click',(e)=>
				if $(e.target).hasClass('b-popup')
		            @hidePopup()
		        return

			$(document).keydown (e) =>
			    if e.keyCode is 27 
			        @hidePopup()
			        return false
			    return
			    
			@$popup.find('input, textarea').on 'blur', (e)=>			
				text = $(e.currentTarget).val()
				$(e.currentTarget).siblings('span').text(text) 
				if text then $(e.currentTarget).parent().removeClass('b-popup__edit_empty')
				return

			@$popup.on 'click', '.b-popup__edit span', (e)=>
				text = $(e.currentTarget).text()
				$(e.currentTarget).parent().addClass('b-popup__edit_empty').find('input, textarea').val(text).focus()
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
			
		showPopup: (itemData) ->
			@date = itemData.date
			full = itemData.full
			description = itemData.description
			name = itemData.name

			$('body').addClass('body-block');
			@$date.text("#{@date.getDate()} #{utils.monthSklon[@date.getMonth()]}")	
			if full			
				@$description.removeClass('b-popup__edit_empty').find('span').text(description)
				@$name.removeClass('b-popup__edit_empty').find('span').text(name)
			else
				@$description.add(@$name).addClass('b-popup__edit_empty').find('span').text('')
				@clearInputs()
			@$popup.fadeIn(100)
			@$warning.removeClass('visible')
			return
		
		hidePopup:() ->
			$('body').removeClass('body-block');
			@$popup.fadeOut(100)
			@calendar.setCurTd(null)
			return

		clearInputs :() ->
			@$popup.find('input, textarea').val('')
			return

	return Popup

