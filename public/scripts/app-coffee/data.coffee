define ['jquery'], ($) ->
	class Data
		info : {}
		constructor: (calendar) ->
			if localStorage['info']
				@info=JSON.parse(localStorage['info'])
			@calendar = calendar

		getData : () ->
			return @info

		setData : (options, save) ->
			key= "#{options.date.getDate()}-#{options.date.getMonth()}-#{options.date.getFullYear()}"	
			if save
				@info[key]={}
				@info[key].descr = options.descr
				@info[key].name = options.name
			else
				delete @info[key]
			localStorage['info']=JSON.stringify(@info)
			return
	return Data