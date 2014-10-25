define ['jquery','utils'], ($, utils) ->
	class SG 
		constructor: (calendar) ->
			@calendar = calendar
			@initHtml()
			@bindHandlers()
		initHtml : () ->
			@$searchQ 	= 	$('.search')
			@$searchSug	= 	$('.sug')
		bindHandlers : () ->
			@$searchQ.bind 'keyup', (e) =>
				query = $(e.currentTarget).val()
				data = @calendar.data.getData()
				isWords = no
				@$searchSug.html('')
				if query.length>2
					@$searchSug.show()
					isWords = no
					for index, value of data			
						if value.descr.toLowerCase().indexOf(query.toLowerCase())>=0
							@appendSgItem(value.descr, query, index)
							isWords = yes
						else if value.name.toLowerCase().indexOf(query.toLowerCase())>=0
							@appendSgItem(value.name, query, index)
							isWords = yes
					@$searchSug.hide() unless isWords
				else
					@$searchSug.hide()
				return
			
			@$searchSug.on 'click', 'li', (e)=>
				@calendar.popup.hidePopup()
				dateMas=$(e.currentTarget).attr('data-date').split('-')
				@calendar.curDate.setMonth(dateMas[1])
				@calendar.curDate.setYear(dateMas[2])
				@calendar.fullContainer()
				@$searchSug.html('').hide()
				@$searchQ.val('')
				return
			return
		appendSgItem : (text, query, date) ->
			replStr = text.replaceAll(query,"<b>#{query}</b>")
			@$searchSug.append("<li data-date='#{date}'><p>#{replStr}</p><span>#{date.split('-')[0]} #{utils.monthSklon[date.split('-')[1]]}</span></li")
			return
							
	return SG


