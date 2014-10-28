define ['jquery','underscore', 'backbone', 'utils', 'text!../templates/sg.html'], ($, _, Backbone, utils, sgTemplate) ->
	SGView = Backbone.View.extend({
		el : $('.b-search')
		initialize : (options)->
			@calendar = options.calendar	
			@render()
			return
		render : ()->
			@initHtml()
			return
		events : {
			'keyup .b-search__input' : 'keyPress'
			'click .b-search__sg li' : 'goToSuggestedCell'
		}

		initHtml : () ->
			@$searchQ 	= 	$('<input />').addClass('b-search__input').attr('placeholder','Поиск...').appendTo(@$el)
			@$searchSug	= 	$('<ul />').addClass('b-search__sg').appendTo(@$el)
			return

		keyPress: (e) ->
			query = $(e.currentTarget).val()
			data = @calendar.data.getData()
			isWords = no
			@$searchSug.html('')
			if query.length>2
				@$searchSug.show()
				isWords = no
				for index, value of data			
					if value.name.toLowerCase().indexOf(query.toLowerCase())>=0
						@appendSgItem(value.name, query, index)
						isWords = yes
					else if value.descr.toLowerCase().indexOf(query.toLowerCase())>=0
						@appendSgItem(value.descr, query, index)
						isWords = yes
				@hideSG() unless isWords
			else
				@hideSG()
			return
			
		goToSuggestedCell : (e) ->
			dateArray=$(e.currentTarget).attr('data-date').split('-')
			@calendar.curDate.setMonth(dateArray[1])
			@calendar.curDate.setYear(dateArray[2])
			@calendar.fullContainer()
			@calendar.hideElements({hidePopup:yes, hideSg:yes})
			@$searchQ.val('')
			return
		appendSgItem : (text, query, date) ->
			templateData = {
				replStr : text.replaceAll(query,"<b>#{query}</b>")
				date : date
				day : date.split('-')[0]
				month : utils.monthSklon[date.split('-')[1]]
			}
			sgHtml = _.template(sgTemplate)(templateData)
			@$searchSug.append(sgHtml)
			return
		hideSG : ()->
			@$searchSug.html('').hide()
			return
	})						
	return SGView


