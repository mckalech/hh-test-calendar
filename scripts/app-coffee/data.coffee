define ['jquery'], ($) ->
	class Data
		info : {}
		constructor: (calendar) ->
			@calendar = calendar

		fullInfo : () ->
			if localStorage['info']
				@info=JSON.parse(localStorage['info'])
			return

		saveInfo : (save) ->
			date = @calendar.$curTd.attr('data-date')
			key= "#{date}-#{@calendar.curDate.getMonth()}-#{@calendar.curDate.getFullYear()}"	
			if save
				@info[key]={}
				@info[key].descr = @calendar.$curTd.attr('data-descr')
				@info[key].name = @calendar.$curTd.attr('data-name')
			else
				delete @info[key]
			localStorage['info']=JSON.stringify(@info)
			return
	return Data