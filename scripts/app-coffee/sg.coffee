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
							replStr = value.descr.replaceAll(query,"<b>#{query}</b>")
							@$searchSug.append("<li data-date='#{index}'><p>#{replStr}</p><span>#{index.split('-')[0]} #{utils.monthSklon[index.split('-')[1]]}</span></li")
							isWords = yes
						else if value.name.indexOf(query)>=0
							replStr = value.name.replaceAll(query,"<b>#{query}</b>")
							@$searchSug.append("<li data-date='#{index}'><p>#{replStr}</p><span>#{index.split('-')[0]} #{utils.monthSklon[index.split('-')[1]]}</span></li")
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
	return SG


