define ['jquery', 'underscore', 'backbone', 'text!../templates/popup.html', 'utils'], ($, _, Backbone, popupTemplate, utils) ->
	PopupView = Backbone.View.extend({
		el : $('.b-popup')
		date : null	
		initialize : (options)->
			@calendar = options.calendar	
			@render()
			@bindHandlers()
			return
		render : ()->
			popupHtml = _.template(popupTemplate)()
			@$el.html(popupHtml);
			@$warning = @$('.b-popup__warning')
			@$description = @$('.b-popup__edit_description')
			@$name = @$('.b-popup__edit_name')
			@$date = @$('.b-popup__date span')
			return
		events : {
			'click' : 'overlayClick'
			'click .b-popup__close' : 'closeClick'
			'blur input, textarea' : 'inputsBlur'
			'click .b-popup__edit span' : 'inputSpansClick'
			'click .b-popup__btn_save' : 'saveClick'
			'click .b-popup__btn_delete' : 'deleteClick'
		}
		
		closeClick : () ->
			@hidePopup()
			return
		overlayClick : (e) ->
			if $(e.target).hasClass('b-popup')
	            @hidePopup()
	        return		
		inputsBlur : (e) ->    			
			text = $(e.currentTarget).val()
			$(e.currentTarget).siblings('span').text(text) 
			if text then $(e.currentTarget).parent().removeClass('b-popup__edit_empty')
			return
		inputSpansClick : (e) ->  
			text = $(e.currentTarget).text()
			$(e.currentTarget).parent().addClass('b-popup__edit_empty').find('input, textarea').val(text).focus()
			return
		saveClick : () ->
			description = @$description.find('span').text()
			name = @$name.find('span').text()
			if description and name	
				@calendar.saveItem({
					data : {
						name : name
						description : description
					} 
					date : @date
				})
			else unless description or name	
				@calendar.deleteItem({date : @date})
			else
				@$warning.addClass('visible')
			return		
		deleteClick : () ->
			@calendar.deleteItem({date : @date})
			return
		bindHandlers : () ->
			$(document).keydown (e) =>
			    if e.keyCode is 27 
			        @hidePopup()
			        return false
			    return
			return		
		showPopup: (itemData) ->
			@date = itemData.date
			full = itemData.full
				
			$('body').addClass('body-block');
			@$date.text("#{@date.getDate()} #{utils.monthSklon[@date.getMonth()]}")	
			if full
				@$description.removeClass('b-popup__edit_empty').find('span').text(itemData.data.description)
				@$name.removeClass('b-popup__edit_empty').find('span').text(itemData.data.name)
			else
				@$description.add(@$name).addClass('b-popup__edit_empty').find('span').text('')
				@clearInputs()
			@$el.fadeIn(100)
			@$warning.removeClass('visible')
			return	
		hidePopup:() ->
			$('body').removeClass('body-block');
			@$el.fadeOut(100)
			@calendar.setCurTd(null)
			return
		clearInputs :() ->
			@$el.find('input, textarea').val('')
			return
	})
	return PopupView

