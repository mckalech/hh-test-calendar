define ['jquery','underscore', 'utils', 'text!../templates/sg.html'], ($, _, utils, sgTemplate) ->
	class SG 
		constructor: (calendar) ->
			@calendar = calendar
			@initHtml()
			@bindHandlers()
		initHtml : () ->
			@$searchQ 	= 	$('.b-search__input')
			@$searchSug	= 	$('.b-search__sg')
		bindHandlers : () ->
			@$searchQ.on 'focus', (e) =>
				@calendar.hideElements({hidePopup:yes})
				return

			@$searchQ.bind 'keyup', (e) =>
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
			
			@$searchSug.on 'click', 'li', (e)=>
				@calendar.popup.hidePopup()
				dateMas=$(e.currentTarget).attr('data-date').split('-')
				@calendar.curDate.setMonth(dateMas[1])
				@calendar.curDate.setYear(dateMas[2])
				@calendar.fullContainer()
				@hideSG()
				@$searchQ.val('')
				return
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
							
	return SG


