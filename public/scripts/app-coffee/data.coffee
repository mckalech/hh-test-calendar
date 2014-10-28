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
		getMonthData : (month, year) ->
			data = @getData()
			monthDataArray = []
			for dataKey of data		
				dateArray = dataKey.split('-').map((el)->parseInt(el))
				itemDate = { day : dateArray[0], month : dateArray[1], year : dateArray[2] }
				dataItem = data[dataKey]
				if dataItem and month is itemDate.month and year is itemDate.year
					monthDataArray[itemDate.day] = dataItem
			return monthDataArray

	return Data