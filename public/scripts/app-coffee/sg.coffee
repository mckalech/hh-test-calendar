define ['jquery','underscore', 'backbone', 'utils', 'text!../templates/search.html', 'text!../templates/sg.html'], ($, _, Backbone, utils, searchTemplate, sgTemplate) ->
	SGView = Backbone.View.extend({
		el : $('.b-search')
		initialize : (options)->
			@calendar = options.calendar	
			@render()
			return
		render : ()->
			searchHtml = _.template(searchTemplate)()
			@$el.html(searchHtml);
			@$searchQ 	= 	$('.b-search__input')
			@$searchSug	= 	$('.b-search__sg')
			return
		events : {
			'keyup .b-search__input' : 'keyPress'
			'click .b-search__sg li' : 'goToSuggestedCell'
		}
		keyPress: (e) ->
			query = $(e.currentTarget).val()
			isWords = no
			data = @calendar.data.getSortedData()
			@$searchSug.html('')
			if query.length>2
				@$searchSug.show()
				isWords = no
				for item in data			
					if item.info.name.toLowerCase().indexOf(query.toLowerCase())>=0
						@appendSgItem(item.info.name, query, item.dateKey)
						isWords = yes
					else if item.info.description.toLowerCase().indexOf(query.toLowerCase())>=0
						@appendSgItem(item.info.description, query, item.dateKey)
						isWords = yes
				@hideSG() unless isWords
			else
				@hideSG()
			return
		goToSuggestedCell : (e) ->
			dateArray=$(e.currentTarget).attr('data-date').split('-')
			newDate = @calendar.curDate.get('date')
			newDate.setDate(dateArray[0])
			newDate.setMonth(dateArray[1])
			newDate.setYear(dateArray[2])
			@calendar.curDate.unset('date',{silent:true})
			@calendar.curDate.set('date',newDate)
			@$searchQ.val('')
			return
		appendSgItem : (text, query, date) ->
			templateData = {
				replStr : text.replaceAll(query,"<b>#{query}</b>")
				date : date
				day : date.split('-')[0]
				month : utils.monthSklon[date.split('-')[1]]
				year : date.split('-')[2]
			}
			sgHtml = _.template(sgTemplate)(templateData)
			@$searchSug.append(sgHtml)
			return
		hideSG : ()->
			@$searchSug.html('').hide()
			return
	})						
	return SGView


